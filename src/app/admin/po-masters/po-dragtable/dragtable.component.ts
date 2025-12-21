import { Component, OnInit, ViewChild } from '@angular/core';  
import { EditableTableComponent } from '@app/admin/core/controls/common/editable-table/editable-table.component';
import { PO_LAYOUT_DT_ENTITY } from '@shared/service-proxies/service-proxies';
import tableDragger from 'table-dragger'  
@Component({  
  selector: 'app-dragtable',  
  templateUrl: './dragtable.component.html' 
})  
export class DragtableComponent implements OnInit {  
  @ViewChild('editTableAttachFile') editTableAttachFile: EditableTableComponent<PO_LAYOUT_DT_ENTITY>;
  constructor() { }  
 public rowData= [    
    {    
        Id: "1",    
        Name: "Sanwar",    
        Age: "25",    
        Address: "Jaipur",    
        City: "Jaipur",    
        Salary: "500000",    
        Department: "IT",    
           
    },    
    {    
        Id: "2",    
        Name: "Nisha",    
        Age: "25",    
        Address: "C-Scheme",    
        City: "Jaipur",    
        Salary: "500000",    
        Department: "IT",    
    },    
    {    
        Id: "3",    
        Name: "David",    
        Age: "25",    
        Address: "C-Scheme",    
        City: "Jaipur",    
        Salary: "500000",    
        Department: "IT",    
    },    
    {    
        Id: "4",    
        Name: "Sam",    
        Age: "25",    
        Address: "C-Scheme",    
        City: "Jaipur",    
        Salary: "500000",    
        Department: "IT",    
    },    
    {    
        Id: "5",    
        Name: "Jyotsna",    
        Age: "25",    
        Address: "C-Scheme",    
        City: "Mumbai",    
        Salary: "500000",    
        Department: "IT",    
    },    
    {    
        Id: "6",    
        Name: "Sid",    
        Age: "25",    
        Address: "C-Scheme",    
        City: "Bangalore",    
        Salary: "500000",    
        Department: "IT",    
    }  
]    
  
  ngOnInit(): void {  
    var id = document.getElementById('table');  
    var dragger = tableDragger(id, {  
    mode: 'column',  
    onlyBody: true,  
    animation: 300  
  });  
  dragger.on('drop',function(from, to){ 
  });  
  }  
    
}  