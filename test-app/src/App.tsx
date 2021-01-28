import React from 'react';
import { LayoutBuilder } from './generic/layout-generator/LayoutBuilder';
import { Wysiwyg } from './generic/wysiwyg/Wysiwyg';

const App = () => {

  return (
    <div className={"App"}>
      <h1>Hello</h1>
      <Wysiwyg label={"test"} />
      <br/>
      <LayoutBuilder/>
    </div>
  );
}

export default App;
