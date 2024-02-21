import { Block } from "slate";

export default {
  document: {
    nodes: [
      {
        match: [
          {
            type: "paragraph",
            min: 1
          },
          {
            type: "tag"
          }
        ]
      }
    ],
    last: { type: "paragraph" },
    normalize: (editor, { code, node }) => {
      switch (code) {
        case "last_child_type_invalid": {
          const paragraph = Block.create("paragraph");
          return editor.insertNodeByKey(node.key, node.nodes.size, paragraph);
        }
        default:
          return editor;
      }
    }
  },
  inlines: {
    tag: {
      isVoid: true
    }
  }
};
