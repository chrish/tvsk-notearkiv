import React, { useEffect, useRef } from 'react';
import './App.css';
import 'datatables.net-dt';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';
import $ from 'jquery';
import SwapVertIcon from '@mui/icons-material/SwapVert';

const MyDataTable = () => {
  const tableRef = useRef();

  useEffect(() => {
    let table;

    // Fetch data and initialize DataTable
    //fetch(`${process.env.PUBLIC_URL}/notearkiv_eksport.json`)
    fetch(`https://raw.githubusercontent.com/chrish/tvsk-notearkiv-data/refs/heads/main/spreadsheet_data.json`)
      .then((response) => response.json())
      .then((jsonData) => {
        // Create HTML table body with correct property names
        const tableBody = jsonData
          .map(
            (row) => `
          <tr>
            <td>${row[0]}</td>
            <td>${row[1]}</td>
            <td>${row[2]}</td>
            <td>${row[3]}</td>
            <td>${row[4]}</td>
            <td>${row[5]}</td>
            <td>${row[6] ?? ''}</td>
          </tr>
        `
          )
          .join('');

        // Insert table body into DOM
        $(tableRef.current).find('tbody').html(tableBody);

        // Destroy existing DataTable instance if it exists
        if ($.fn.DataTable.isDataTable(tableRef.current)) {
          $(tableRef.current).DataTable().destroy();
        }

        // Initialize DataTable
        table = $(tableRef.current).DataTable({
          responsive: true,
          select: false,
          paging: false,
          columnDefs: [
            {
              targets: 5, // your column index
              render: function (data, type, row) {
                if (type === 'sort' || type === 'type') {
                  if (data == null || data === '') return 999999999;

                  const text = String(data).trim();

                  // Pure number: 1, 2, 10
                  if (/^\d+$/.test(text)) {
                    return parseInt(text, 10);
                  }

                  // H-number: H1, H2, H10
                  const hMatch = text.match(/^H(\d+)$/i);
                  if (hMatch) {
                    return 1000000 + parseInt(hMatch[1], 10);
                  }

                  // Fallback for other text values
                  return 999999999;
                }

                return data;
              }
            }
          ]
          // Other options if needed
        });
      })
      .catch((error) => console.error('Error fetching data:', error));

    // Cleanup on unmount
    return () => {
      if (table) {
        table.destroy();
      }
    };
  }, []);

  return (
    <div>
      <h1 class="tvskh1">Notearkiv TVSK</h1>
      <p>Kode på github.com/chrish/tvsk-notearkiv, data eksporteres daglig klokken 20 til github.com/chrish/tvsk-notearkiv-data</p>
      <table class="noteTable" ref={tableRef} className="display" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Tittel <SwapVertIcon /></th>
            <th>Sjanger/kommentar <SwapVertIcon /></th>
            <th>Type <SwapVertIcon /></th>
            <th>Komponist <SwapVertIcon /></th>
            <th>Arrangør <SwapVertIcon /></th>
            <th>Arkivnummer <SwapVertIcon /></th>
            <th><strong>S</strong><span>cannet</span>, <strong>T</strong><span>utti</span> <SwapVertIcon /></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
};

export default MyDataTable;
