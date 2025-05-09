
import {  useState } from "react"
import Data from "../data.json"
import '../Css/Table.css'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSortUp,faSortDown } from '@fortawesome/free-solid-svg-icons'; 
import { Row } from "../Rowinterface";
export default function Table() {
    
       
    const [rows, setRows] = useState<Row[]>(Data);
    const [filters, setFilters] = useState({})
    const [sortColumn, setSortColumn] = useState("oid");
    const [sortDirection, setSortDirection] = useState('asc');
    //Handle the sort direction on each column
    const handleSort = (column:any) => {
        if (sortColumn === column) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
        setSortColumn(column);
        setSortDirection('asc');
        }
        };
    //Handle the Filter
    const handleFilterChange = (column:any,event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(event.target.selectedOptions)
        const value = Array.from(event.target.selectedOptions, (option) => option.value);
        setFilters({...filters,[column]: value,});
        };
    //Function returning Filter/sorted Array
    const filteredRows = () => { 
        let result = [...rows];
        Object.keys(filters).forEach((column) => {
            
            const columnFilters = filters[column];
            console.log(column,"column",columnFilters,"columnFilter")
            if (columnFilters.length > 0) {
             result = result.filter((row) => {
              if (column === "daysSinceOrder") {
               return columnFilters.some((filterValue) => {
                const number = parseInt(filterValue.substring(1), 10);
                 return row[column] < number;
               });
              } else {
               return columnFilters.includes((row[column]));
              }
             });
            }
           });
           //IF a sort column is selected preform sort on the data based on the selected column
        if (sortColumn) {
         result.sort((a, b) => {
          const aValue = a[sortColumn];
          const bValue = b[sortColumn];
      
          if (aValue < bValue) {
           return sortDirection === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
           return sortDirection === 'asc' ? 1 : -1;
          }
          return 0;
         });
        }
      
        return result;
       };
    //Set Preset Filter   
    const presetFilter=()=>{
            setFilters({...filters,"model":"Lotus","type":"Sample"})
    }
    //Clear All Applied Filters
    const clearpresetFilter=()=>{
        setFilters([])
    }
    //Getting the Headers for the table from the Data
    const headers =Object.keys(rows[0]) 
    console.log(headers,"Header")

  return (  
            <>
          <button className="btn btn-dark" onClick={()=>presetFilter()} style={{margin:"10px"}}>Preset Filter</button>
          <button className="btn btn-secondary" onClick={()=>clearpresetFilter()} style={{margin:"10px"}}>Clear Preset Filter</button>

          <div className="Container">
            <div className="row">
            <div className="col-sm-12" style={{overflowX:"auto"}}>
            <table className="table table-secondary table-striped table-bordered">
                <thead>
                <tr>
                    {headers.map((header) => (
                        <th scope="col" className="Header" key={header}>
                            <div className="d-flex justify-content-between align-items-center headerTitle" onClick={() => handleSort(header)}>
                                <span  style={{ cursor: 'pointer' }}>
                                {header}
                                </span>
                                {sortColumn === header && (
                                <span>{sortDirection === 'asc' ? <FontAwesomeIcon icon={faSortUp} size="lg" /> : <FontAwesomeIcon icon={faSortDown} size="lg" />}</span>
                                )}
                            </div>
                            
                            {/* if the header is daysSinceOrder render the static Select */}
                                {(header==="daysSinceOrder")?
                                <select
                                className="form-control form-control-sm select "
                                value={filters[header]}
                                multiple
                                onChange={(e) => handleFilterChange(header, e)}
                                >
                                
                                <option key="lessThan5" value="<5">Less Than 5</option>
                                <option key="lessThan10" value="<10">Less Than 10</option>
                                <option key="lessThan15" value="<15">Less Than 15</option>
                                <option key="lessThan30" value="<30">Less Than 30</option>
                            </select>
                                :<select
                                className="form-control form-control-sm select "
                                multiple
                                value={filters[header]}
                                disabled={header==="oid"} 
                                
                                onChange={(e) => handleFilterChange(header, e)}
                                >
                                {/* Extracting the values for the select form the Data and removing duplicates */}
                                {Array.from(new Set(rows.map((row) => (row[header]))))
                                .map((value) => (
                                <option key={value}  style={{visibility:(header==="oid"?"hidden":"visible")}}   value={value}>
                                {value}
                                </option>
                                
                                ))}
                            </select>}
                            
                            <div className="Clear_Select" >
                            <span onClick={(e) => {
                                
                                setFilters({ ...filters, [header]: [] });
                                }}>Clear</span>
                            <span  style={{visibility:(header==="daysSinceOrder"?"hidden":"visible")}}  onClick={(e) => {
                                const allValues = Array.from(new Set(rows.map((row) => (row[header]))));
                                setFilters({ ...filters, [header]: allValues });
                                }}>
                                    Select All
                                </span>
                        </div>
                    </th>
                    
                    ))}
                </tr>
                
                </thead>
                <tbody>
                {filteredRows().map((row) => (
                    <tr key={row.oid}>
                    {headers.map((header) => (
                        <td key={header}  style={{fontWeight:header==="oid"||header==="type"||header==="daysSinceOrder"?"bold":""}} >{row[header]}</td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            </div>
            
        </div>
            </>
    
  );
}
