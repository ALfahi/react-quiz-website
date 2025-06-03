import React from 'react';
import '../css/Status.css';

function Status({ status = "default"}) {
  const className = `status ${status.toLowerCase()}`;// different statuses will have different colours, so make a new class name for them.
  return <p className={className}>{status}</p>;
}

export default Status;