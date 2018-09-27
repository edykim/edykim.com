import React from 'react';
import './DateTime.css';

export default ({ at }) => <time className={"DateTime"} dateTime={at}>{at.substring(0, 10)}</time>
