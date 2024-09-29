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
          pageLength: 100,
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
      <h1>Notearkiv TVSK</h1>
      <table class="noteTable" ref={tableRef} className="display" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Tittel <SwapVertIcon /></th>
            <th>Sjanger/kommentar <SwapVertIcon /></th>
            <th>Komponist <SwapVertIcon /></th>
            <th>Arrangør <SwapVertIcon /></th>
            <th>Arkivnummer <SwapVertIcon /></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
};

export default MyDataTable;
