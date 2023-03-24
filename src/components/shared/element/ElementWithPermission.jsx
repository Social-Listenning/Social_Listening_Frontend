import React from 'react';
import { decodeToken } from 'react-jwt';

export default function ElementWithPermission(props) {
  const permissionRequired = props.permission;
  if (permissionRequired) {
    const token = localStorage.getItem('token');
    const decodedToken = decodeToken(token);
    const permissionList = decodedToken.permissions;

    if (permissionList.includes(permissionRequired)) {
      return <>{props.children}</>;
    }
  }
  return;
}
