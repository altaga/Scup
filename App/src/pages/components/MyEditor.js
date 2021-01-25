import React from 'react';
import SunEditor from "suneditor-react";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

class MyEditor extends React.Component {

    constructor(props) {
        super(props)
        const { cookies } = this.props;
        this.state = {
            mydata: cookies.get('text' + this.props.patient)
        }
    }

    render() {
        const { cookies } = this.props;
        return (
            <div>
                <SunEditor setOptions={{
                    height: "30.2vh",
                    buttonList: [
                        ['undo', 'redo', 'font', 'fontSize', 'formatBlock'],
                        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'removeFormat'],
                        ['fontColor', 'hiliteColor', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'table'],
                        ['link', 'video', 'fullScreen']
                    ] // Or Array of button list, eg. [['font', 'align'], ['image']]
                    // Other option
                }}
                    setContents={cookies.get('text' + this.props.patient)}
                    onChange={(content) => {
                        const { cookies } = this.props;
                        const data = content;
                        if (this.props.patient !== 0) {
                            console.log(typeof(data))
                            cookies.set('text' + this.props.patient, data, { path: '/tab' });
                            this.setState({
                                mydata: data
                            })
                        }
                    }}
                />
            </div>
        );
    }
}
export default MyEditor;