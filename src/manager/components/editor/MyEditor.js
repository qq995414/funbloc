import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'


const MyEditor = ({ setContent }) => {


    return (
        <CKEditor
            editor={ClassicEditor}
            data=""
            config={{
                removePlugins: ["EasyImage", "ImageUpload", "MediaEmbed"]
            }}
            onReady={editor => {
                // You can store the "editor" and use when it is needed.
                // console.log('Editor is ready to use!', editor)
            }}
            onChange={(event, editor) => {
                const data = editor.getData()
                setContent(data)
            }}
            onBlur={(event, editor) => {
                // console.log('Blur.', editor)
            }}
            onFocus={(event, editor) => {
                // console.log('Focus.', editor)
            }}
        />
    )
}

export default MyEditor