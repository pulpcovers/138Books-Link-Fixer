// ==UserScript==
// @name         138Books - Auto New Tab Link Fixer
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Hooks into DataTables API to enable opening in a new tab by default
// @author       You
// @match        http://138books.com/Guest/BookIndex*
// @updateURL    https://github.com/pulpcovers/138Books-Link-Fixer/raw/refs/heads/main/138booksLinkFixer.js
// @downloadURL  https://github.com/pulpcovers/138Books-Link-Fixer/raw/refs/heads/main/138booksLinkFixer.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function transformRows() {
        // Access the DataTable instance directly
        const table = $('#ResultTable').DataTable();

        // Loop through visible rows
        $('#ResultTable tbody tr').each(function() {
            const $row = $(this);

            if ($row.hasClass('link-fixed')) return;

            // Get the data object from the table's internal memory
            const rowData = table.row(this).data();

            if (rowData && rowData.id) {
                // Using "BookDetail" as found in the site's source code
                const detailUrl = `/Guest/BookDetail/${rowData.id}`;

                // Kill the original click event
                $row.off('click');
                $row.css('cursor', 'pointer');

                // Wrap cell contents in a real <a> tag with target="_blank"
                $row.find('td').each(function() {
                    const $cell = $(this);
                    const originalHTML = $cell.html();

                    // Added target="_blank" and rel="noopener" for security/performance
                    $cell.html(`
                        <a href="${detailUrl}"
                           target="_blank"
                           rel="noopener"
                           style="display:block; width:100%; height:100%; color:inherit; text-decoration:none;">
                           ${originalHTML}
                        </a>`);
                });

                $row.addClass('link-fixed');
            }
        });
    }

    // Handle the dynamic nature of the table (pagination/search)
    $(document).ready(function() {
        const table = $('#ResultTable').DataTable();

        // Watch for when the table re-renders (draws)
        table.on('draw.dt', function() {
            setTimeout(transformRows, 150);
        });

        // Initial run
        setTimeout(transformRows, 500);
    });
})();
