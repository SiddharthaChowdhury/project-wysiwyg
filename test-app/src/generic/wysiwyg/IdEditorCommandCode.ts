export enum IdEditorCommandCode {
    bold = "bold",
    italic = "italic",
    underline = "underline",
    strikeThrough = "strikeThrough",

    justifyLeft = "justifyLeft",
    justifyCenter = "justifyCenter",
    justifyRight = "justifyRight",
    justifyFull = "justifyFull",

    insertUnorderedList = "insertUnorderedList",
    insertOrderedList = "insertOrderedList",

    foreColor = "foreColor",
    backColor = "backColor",
    fontSize = "fontSize",

    createLink = "createLink",
    unlink = "unlink",

    insertHorizontalRule = "insertHorizontalRule",
    insertImage = "insertImage",

    subscript = "subscript",
    superscript = "superscript",

    undo = "undo", // Does not work in Firefox
    redo = "redo", // Does not work in Firefox

    insertTable = "insertTable",

    removeFormat= "removeFormat",

    insertHTML = "insertHTML",
}
