import React from 'react';

const historyStyle = {
  background: '#fff9f5',
  margin: '3rem auto',
  padding: '1rem',
  fontSize: '0.8em',
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
