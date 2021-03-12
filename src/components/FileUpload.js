import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@helloinspire/melodic-react'

const FileUpload = ({ upload }) => {
  const [file, setFile] = useState(null)
  const [img, setImg] = useState(null)

  const uploadImage = (e) => {
    if(e.target.files){
      let newFile = e.target.files[0]
      setFile(e.target.files[0])
      newFile['filename'] = e.target.files[0].name
      let imgUrl = URL.createObjectURL(newFile)
      setImg(imgUrl)
      upload(imgUrl)
    }
  }

  const getFile = () => {
    document.getElementById('fileInput').click()
  }

  return (
    <>
      {img &&
        <>
          <img className="w-50" src={img}/>
          <p className="m-0 pl-2">{file.name}</p>
        </>
      }
      <Button className="btn btn-block mx-auto btn-outline-secondary mb-3" onClick={getFile}>
        <svg width="1.25em" height="1.25em" viewBox="0 0 16 16" className="bi bi-upload" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
          <path fillRule="evenodd" d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
        </svg>
        <p className="m-0 pl-2">Attach File</p>
        <input
          style={{ display: 'none' }}
          type="file"
          id="fileInput"
          name="fileInput"
          onChange={(e) => uploadImage(e)}
        />
      </Button>
    </>
  )
}

FileUpload.propTypes = {
  upload: PropTypes.func
}

export default FileUpload
