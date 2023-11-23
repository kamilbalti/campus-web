import { useState } from "react"
import { useSelector } from "react-redux"
import { setUserDetail } from "../Redux-Toolkit/BazarSlice"
import { ref, set } from "firebase/database"
import { db } from "../Firebase/firebase"
import { Navigate, Route, Router, Routes, useNavigate } from "react-router"
import { Link } from "react-router-dom"
import { BiArrowBack } from 'react-icons/bi'
import { Box, Modal } from "@mui/material"

const StudentReq = ({ setShowDetail, showDetail }) => {
    const [edu, setEdu] = useState('Matric')
    const { userDetail } = useSelector(e => e)
    const status = userDetail?.status
    const [exp, setExp] = useState(status !== "Student" ? 0 : "")
    const allEdu = ['Matric', 'Inter', 'Bachelor', 'Master']
    const [check, setCheck] = useState(false)
    const changeExp = (e) => {
        if (status == 'Student' && e.target.value.length <= 2)
            if ((e.target.value >= 0 && e.target.value <= 99) && !e.target.value.includes('-') && !e.target.value.includes('*') && !e.target.value.includes('/') && !e.target.value.includes('+') && !e.target.value.includes('e'))
                setExp(e.target.value)
    }
    const submit = () => {
        setCheck(true)
        if (!exp == "" || !exp.length == 0) {
            let tempdata = { ...userDetail }
            tempdata.exp = exp
            tempdata.edu = edu
            setUserDetail(tempdata)
            set(ref(db, 'users/' + tempdata?.uid), {
                userDetail: tempdata
            })
                .then(() => {
                    setShowDetail(false)
                }
                )
        }
    }

    const handleClose = () => {
        setShowDetail(false)
    }
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 590,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <form>
            {status == 'Student' && (!userDetail?.exp || userDetail?.exp != 0) &&
                <Modal open={showDetail} onClose={handleClose} aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description">
                    <Box sx={style}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                            <div style={{ cursor: 'pointer' }} onClick={() => {
                                setShowDetail(false)
                            }}>
                                <BiArrowBack />
                            </div>
                            <h2>Before apply you have to fill this</h2>
                        </div>
                        <div className='signUpRowDiv'>
                            <select className='signUpTextInput stReqSelect' value={edu} onChange={(e) => setEdu(e.target.value)}>
                                {allEdu?.map((item) => 
                                    <option className='signUpOption stReqOption'>{item}</option>)}
                            </select>
                        </div>
                        <div className='signUpRowDiv'>
                            <input placeholder={'Experience:'} className='signUpTextInput stReqSelect' type='number' value={exp} onChange={changeExp} />
                        </div>
                        <button onClick={submit} disabled={exp == ''} className={exp != '' ? "LogOutBut" : "LogOutBut signUpBgGray"} type="submit">Submit</button>
                    </Box>
                </Modal>
            }
        </form>
    )
}
export default StudentReq