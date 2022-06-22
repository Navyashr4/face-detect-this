import React from 'react';

const Rank = ({name, entries}) =>{
    let ucName;
    if(name.charAt(0) !== null || name !== undefined){
        ucName = name.charAt(0).toUpperCase() + name.slice(1);  
    }else{
        ucName = name; 
    }
    return(
        <div>
            <div className ='white f3'>
                {`${ucName}, your current entry count is `}
            </div>
            <div className ='white f1'>
                {entries}
            </div>
        </div>
    );
}

export default Rank;
