import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class MyEditor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            mydata: ""
        }
    }

    render() {
        return (
            <div className="MyEditor">
                <CKEditor
                    editor={ClassicEditor}
                    data={this.state.mydata}
                    onReady={editor => {
                        const { cookies } = this.props;
                        console.log(cookies.get('text'))
                        this.setState({
                            mydata: cookies.get('text')
                        })
                    }}
                    onChange={(content) => {
                        const { cookies } = this.props;
                        const data = content.getData();
                        cookies.set('text', data, { path: '/tab' });
                        console.log(cookies.get('text'))
                        this.setState({
                            mydata: data
                        })
                    }}
                    onBlur={(event, editor) => {
                        console.log('Blur.', editor);
                    }}
                    onFocus={(event, editor) => {
                        console.log('Focus.', editor);
                    }}
                />
            </div>
        );
    }
}

export default MyEditor