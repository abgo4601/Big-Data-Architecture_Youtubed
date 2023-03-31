import React, {useState} from 'react';

function List(props) {
    return (
        <div>
            <h3>{props.type}</h3>
            {props.list.map((li, i) => {
                return <div key={i}>{li}</div>
            })}
        </div>
    );
}

export default List;