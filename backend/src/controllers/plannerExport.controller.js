import { getPrisma } from '../loaders/database.js';

/**
 * Export Hotel Room Assignment Manifest to PDF (3-Pillar Enforced)
 * GET /api/planner/:id/pdf?view=SHARED&eventId=all
 */
export const exportRoomsToPdf = async (req, res) => {
    try {
        const prisma = getPrisma();
        const { id } = req.params;
        const weddingId = req.weddingId; // Pillar 1: Enforced workspace isolation via auth middleware

        // Extract multi-event and visibility metrics from the active client session view state
        const view = req.query.view || 'SHARED';
        const eventId = req.query.eventId;

        const arrangement = await prisma.arrangement.findFirst({
            where: {
                id,
                weddingId
            },
            include: {
                rooms: {
                    include: {
                        assignments: {
                            include: {
                                guest: true,
                                arrangementGuest: true
                            }
                        }
                    },
                    orderBy: { roomNumber: 'asc' }
                }
            }
        });

        // Check if row exists within the workspace tenant boundaries
        if (!arrangement) {
            return res.status(404).json({
                success: false,
                message: "The requested layout arrangement profile could not be found."
            });
        }
        if (arrangement.visibility === 'BRIDE_PRIVATE' && req.memberContext?.role !== 'BRIDE') {
            return res.status(403).json({
                success: false,
                message: "Access Denied: This arrangement manifest is locked exclusively to the Bride's private profile space."
            });
        }
        if (arrangement.visibility === 'GROOM_PRIVATE' && req.memberContext?.role !== 'GROOM') {
            return res.status(403).json({
                success: false,
                message: "Access Denied: This arrangement manifest is locked exclusively to the Groom's private profile space."
            });
        }

        if (eventId && eventId !== 'all' && arrangement.eventId !== eventId) {
            return res.status(403).json({
                success: false,
                message: "Access Denied: The requested arrangement manifest does not belong to your active event tab context."
            });
        }

        // Look up sub-event name dynamically to render a custom document subtitle banner
        let subEventNameBanner = "Master Workspace Overview Dashboard";
        if (arrangement.eventId) {
            const eventDetails = await prisma.event.findFirst({
                where: { id: arrangement.eventId, weddingId }
            });
            if (eventDetails) {
                subEventNameBanner = `${eventDetails.name} Tab View`;
            }
        }

        // Compute dynamic operational hospitality layout aggregate metrics
        let totalRooms = arrangement.rooms.length;
        let totalCapacity = 0;
        let totalAssignedGuests = 0;
        let tableRowsHtml = '';

        arrangement.rooms.forEach((room) => {
            totalCapacity += room.capacity || 0;
            const currentRoomOccupancyCount = room.assignments?.length || 0;
            totalAssignedGuests += currentRoomOccupancyCount;

            const assignedNames = room.assignments && room.assignments.length > 0
                ? room.assignments.map(a => a.guest?.name || a.arrangementGuest?.name || 'Assigned Guest').join(', ')
                : '<span style="color: #a0aec0; font-style: italic;">Vacant / No guests assigned</span>';

            tableRowsHtml += `
                <tr>
                    <td class="room-num">${room.roomNumber}</td>
                    <td>${room.familyName || 'General / Unaffiliated Group'}</td>
                    <td class="center">${room.capacity || 0}</td>
                    <td class="center">${currentRoomOccupancyCount}</td>
                    <td>${assignedNames}</td>
                </tr>
            `;
        });

        const remainingVacancies = totalCapacity - totalAssignedGuests;

        // Construct high-fidelity landscape print asset template markup payload string 
        const htmlTemplatePayload = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    @page {
                        size: A4 landscape;
                        margin: 15mm 12mm;
                        @bottom-right {
                            content: "Page " counter(page) " of " counter(pages);
                            font-family: 'Helvetica Neue', Arial, sans-serif;
                            font-size: 8pt;
                            color: #718096;
                        }
                    }
                    body {
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        color: #2d3748;
                        margin: 0;
                        padding: 0;
                        background-color: #ffffff;
                    }
                    .header-container {
                        border-bottom: 2px solid #1b365d;
                        padding-bottom: 10px;
                        margin-bottom: 20px;
                    }
                    h1 {
                        color: #1b365d;
                        font-size: 22pt;
                        margin: 0 0 5px 0;
                        font-weight: 700;
                    }
                    .subtitle {
                        color: #b5893d;
                        font-size: 9.5pt;
                        text-transform: uppercase;
                        font-weight: bold;
                        letter-spacing: 1.2px;
                        margin: 0;
                    }
                    .scope-badge {
                        float: right;
                        background-color: #1b365d;
                        color: #ffffff;
                        font-size: 8.5pt;
                        font-weight: bold;
                        padding: 4px 10px;
                        border-radius: 6px;
                        text-transform: uppercase;
                        margin-top: 5px;
                    }
                    .stats-grid {
                        margin-bottom: 25px;
                        width: 100%;
                        display: table;
                        table-layout: fixed;
                        border-collapse: separate;
                        border-spacing: 10px 0;
                    }
                    .stat-card {
                        display: table-cell;
                        background-color: #f7fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 8px;
                        padding: 12px;
                        text-align: center;
                    }
                    .stat-val {
                        font-size: 18pt;
                        font-weight: bold;
                        color: #1b365d;
                        margin-bottom: 2px;
                    }
                    .stat-lbl {
                        font-size: 8pt;
                        color: #718096;
                        text-transform: uppercase;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                    }
                    th {
                        background-color: #1b365d;
                        color: #ffffff;
                        font-size: 9.5pt;
                        font-weight: bold;
                        text-transform: uppercase;
                        padding: 12px 10px;
                        border: 1px solid #1b365d;
                        letter-spacing: 0.5px;
                    }
                    td {
                        font-size: 9.5pt;
                        padding: 10px;
                        border: 1px solid #e2e8f0;
                        vertical-align: middle;
                    }
                    tr:nth-child(even) td {
                        background-color: #fcfdfe;
                    }
                    .room-num {
                        font-weight: bold;
                        color: #1b365d;
                        text-align: center;
                        font-size: 10.5pt;
                    }
                    .center {
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="header-container">
                    <div class="scope-badge">View Mode: ${view}</div>
                    <h1>Hotel Room Assignment Manifest — ${arrangement.name}</h1>
                    <p class="subtitle">${subEventNameBanner}</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card"><div class="stat-val">${totalRooms}</div><div class="stat-lbl">Total Rooms</div></div>
                    <div class="stat-card"><div class="stat-val">${totalCapacity}</div><div class="stat-lbl">Max Bed Capacity</div></div>
                    <div class="stat-card"><div class="stat-val">${totalAssignedGuests}</div><div class="stat-lbl">Guests Assigned</div></div>
                    <div class="stat-card"><div class="stat-val">${remainingVacancies}</div><div class="stat-lbl">Remaining Vacancies</div></div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 12%;">Room Number</th>
                            <th style="width: 25%;">Family Grouping Affiliation</th>
                            <th style="width: 13%;">Bed Capacity</th>
                            <th style="width: 13%;">Occupied Slots</th>
                            <th style="width: 37%;">Assigned Check-In Guests List</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsHtml || '<tr><td colspan="5" style="text-align: center; color: #718096; font-style: italic; padding: 20px;">No hotel rooms initialized inside this arrangement plan context yet.</td></tr>'}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        const puppeteer = (await import('puppeteer-core')).default;
        const browser = await puppeteer.launch({
            headless: true,
            channel: 'chrome',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(htmlTemplatePayload, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            landscape: true,
            printBackground: true,
            margin: { top: '15mm', bottom: '15mm', left: '10mm', right: '10mm' }
        });

        await browser.close();

        const safeFileNameString = arrangement.name.toLowerCase().replace(/[^a-z0-9]/g, '_');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="hotel_manifest_${safeFileNameString}.pdf"`);
        return res.send(pdfBuffer);

    } catch (error) {
        console.error("Critical Enforced 3-Pillar Hotel Manifest PDF Compilation Failure:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error occurred while transforming room configuration layout matrices into document assets."
        });
    }
};