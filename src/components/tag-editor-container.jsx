import React from "react";
import { Value } from 'slate';
import { Editor } from "slate-react";
import Html from 'slate-html-serializer';

import TagEditor from "./tag-editor";
import uuid from "uuid";

const randomTagText = () => {
  return uuid.v4().substring(2, 8);
};

// Define Rule
// Define a custom HTML serializer
const htmlSerializer = new Html({
  rules: [
    {
      // Serialize paragraph blocks
      deserialize(el, next) {
        if (el.tagName === 'P') {
          return {
            object: 'block',
            type: 'paragraph',
            nodes: next(el.childNodes),
          };
        }
      },
      serialize(obj, children) {
        if (obj.object === 'block' && obj.type === 'paragraph') {
          return <p>{children}</p>;
        }
      },
    },
    {
      // Serialize list item blocks
      deserialize(el, next) {
        if (el.tagName === 'LI') {
          return {
            object: 'block',
            type: 'list-item',
            nodes: next(el.childNodes),
          };
        }
      },
      serialize(obj, children) {
        if (obj.object === 'block' && obj.type === 'list-item') {
          return <li>{children}</li>;
        }
      },
    },
    {
      // Serialize ordered list blocks
      deserialize(el, next) {
        if (el.tagName === 'OL') {
          return {
            object: 'block',
            type: 'ordered-list',
            nodes: next(el.childNodes),
          };
        }
      },
      serialize(obj, children) {
        if (obj.object === 'block' && obj.type === 'ordered-list') {
          return <ol>{children}</ol>;
        }
      },
    },
    {
      // Serialize mathml-expression inline nodes
      deserialize(el, next) {
        if (el.tagName === 'SPAN' && el.getAttribute('class') === 'mathml-expression') {
          const mathML = el.getAttribute('data-mathml');
          return {
            object: 'inline',
            type: 'mathml-expression',
            data: {
              mathML,
            },
            nodes: next(el.childNodes),
          };
        }
      },
      serialize(obj, children) {
        
        if (obj.object === 'inline' && obj.type === 'mathml-expression') {
          console.log('obj**', obj.toJS())
          const mathML = obj.data.get('mathML');
          return (
            <span className="mathml-expression" data-mathml={mathML}>
              {children}
            </span>
          );
        }
      },
    },
    // Add more serialization rules for other block types as needed
    // Customize rules for other inline nodes, marks, etc.
  ],
});


// Example Slate.js content
const exampleValue = {
  object: 'value',
  document: {
    object: 'document',
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                object: 'leaf',
                text: 'LIST:',
                marks: [],
              },
            ],
          },
        ],
      },
      {
        object: 'block',
        type: 'ordered-list',
        nodes: [
          {
            object: 'block',
            type: 'list-item',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    object: 'leaf',
                    text: '',
                    marks: [],
                  },
                ],
              },
              {
                object: 'inline',
                type: 'mathml-expression',
                data: {
                  mathML: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>e</mi><mo>=</mo><mi>m</mi><msup><mi>c</mi><mn>2</mn></msup></math>',
                },
                nodes: [
                  {
                    object: 'text',
                    leaves: [
                      {
                        object: 'leaf',
                        text: '',
                        marks: [],
                      },
                    ],
                  },
                ],
              },
              {
                object: 'text',
                leaves: [
                  {
                    object: 'leaf',
                    text: '',
                    marks: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

export default class TagEditorContainer extends React.PureComponent {
  state = {
    query: "",
    tags: [
      { value: 1111 },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() },
      { value: randomTagText() }
    ]
  };

  componentDidMount() {
    // Test Mathml
    // Serialize the Slate.js Value to HTML
    // const jsonDocFormat = fromJS(exampleValue);
    // console.log('jsonDocFormat', jsonDocFormat)
    
    // const serializedHtml = htmlSerializer.serialize(Value.fromJSON(exampleValue));
    // console.log(serializedHtml);
  }

  _handleQueryChange = query => {
    this.setState({ query });
  };

  _handleAddTag = text => {
    this.setState(prevState => {
      return {
        tags: [...prevState.tags, { value: text }],
        query: ""
      };
    });
  };

  render() {
    return (
      <div style={{display: "flex", alignItems: "center", flexDirection: 'column'}}>

        <TagEditor
          query={this.state.query}
          tags={this.state.tags}
          onQueryChangedRequest={this._handleQueryChange}
          onTagAddedRequest={this._handleAddTag}
        />

        {/* <br />

        <Editor
          value={Value.fromJSON(exampleValue)} /> */}

      </div>
    );
  }
}
