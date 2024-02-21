import React, { createRef } from "react";
import { Editor } from "slate-react";
import { Value } from "slate";

import TagPlugin from "./tag-plugin";
import schema from "../config/schema";
import parseValue from "../config/parse-value";

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            text: ""
          }
        ]
      }
    ]
  }
});

export default class TagEditor extends React.PureComponent {
  state = {
    plugins: [],
    value: initialValue
  };

  editorRef = createRef();

  componentDidMount() {

    const plugins = [TagPlugin(this._handleAddTag)];
    const value = parseValue(
      this.props.tags,
      this.props.query,
      this.state.value ? this.state.value.selection : null
    );
    // console.log('value***', value.toJS())
    this.setState({ plugins, value });
  }

  componentDidUpdate(prevProps) { 
    // console.log('this.state.value', this.editorRef.current.querySelectorAll("[data-slate-zero-width][data-slate-length]"));
    const nodes = this.editorRef.current.querySelectorAll("[data-slate-zero-width][data-slate-length]");
    // console.log('node.innerHTML- BEFORE***', nodes);

    nodes.forEach(node => {
      // node.innerHTML = node.innerHTML.replace('&#xFEFF;', '');
      node.innerHTML = '&nbsp;';
      // console.log('node.innerHTML- AFTER***', node);
    });
  }

  componentWillReceiveProps(nextProps) {

    if (
      this.props.query !== nextProps.query ||
      this.props.tags !== nextProps.tags
    ) {
      const nextValue = parseValue(
        nextProps.tags,
        nextProps.query,
        this.state.value.selection
      );
      this.setState({
        value: nextValue
      });
    }
  }

  _handleChange = ({ value, operations }) => {
    this.setState({ value }, () => {
      const { selection } = value;
      // NOTE: Capturing the end of selection because if CTRL/CMD+A
      //       selects the whole document we actually care about text
      //       value of the "query" part of the input which is at the end
      const currentNode = value.document.getNode(selection.end.key);

      const insertTextOperation = Boolean(
        operations.size === 1 &&
          operations.find(operation => operation.type === "insert_text")
      );

      if (currentNode && insertTextOperation) {
        this.props.onQueryChangedRequest(currentNode.text);
      }

      if (this.props.onChange) {
        this.props.onChange({ value, operations });
      }
    });
  };

  _handleAddTag = text => {
    this.props.onTagAddedRequest(text);
  };


  render() {
    return (
      <div className="editor-collapsible" ref={this.editorRef}>
        <Editor
          value={this.state.value}
          plugins={this.state.plugins}
          schema={schema}
          onChange={this._handleChange}
        />
      
      </div>
    );
  }
}


