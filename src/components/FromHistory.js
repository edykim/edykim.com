import React from 'react';

const historyStyle = {
  margin: '1rem auto',
  padding: '0rem',
  fontSize: '0.8em',
  color: '#666',
}

export default ({ history }) => {
  if (history) {
    return (
      <div>
        {history.map(({ from, movedAt }, index) =>
          <div style={historyStyle} key={index}>이 글은 {from} 에서 옮겨온 글입니다.</div>
        )}
      </div>
    );
  }
  return null;
}
