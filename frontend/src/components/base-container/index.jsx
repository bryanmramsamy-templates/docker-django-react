import React from 'react';
import { TestQueries } from '../../test-query';


/**
 * Main wrapper container.
 *
 * Should contain every components visible on every page.
 * @param {*} children Children components
 * @return Renders the base container and its children
 */
const BaseContainer = ({ children }) => {
  return (
    <div className="BaseContainer">
      <TestQueries/>
      { children }
    </div>
  );
}


export default BaseContainer;