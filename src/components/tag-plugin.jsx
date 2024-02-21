// @flow

import React from "react";
import classNames from "classnames";

const TagsPlugin = onTagAddedRequest => {
  return {
    renderNode: (props, editor, next) => {
      const { node, attributes, children } = props;
      const data = node.get("data");

      switch (node.type) {
        case "tag":
          return (
            <span
              {...attributes}
              className={classNames("tag", {
                "tag--focused": props.isFocused
              })}
            >
              {data.get("tagContents")}
              {children}
            </span>
          );
        default:
          return next();
      }
    },
    onKeyDown: (event, editor, next) => {
      if (event.keyCode === 188) {
        event.preventDefault();

        const { value } = editor;
        const { selection } = value;
        const currentNode = value.document.getNode(selection.start.path);

        onTagAddedRequest(currentNode.text, event);
        return;
      }
      return next();
    }
  };
};

export default TagsPlugin;
