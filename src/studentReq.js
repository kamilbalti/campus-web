import { useState } from "react"
import { useSelector } from "react-redux"
import { setUserDetail } from "./Redux-Toolkit/BazarSlice"
import { ref, set } from "firebase/database"
import { db } from "./firebase"
import { Navigate, Route, Router, Routes, useNavigate } from "react-router"
import { Link } from "react-router-dom"
import { BiArrowBack } from 'react-icons/bi'

const StudentReq = ({setShowDetail}) => {
    // const navigate = useNavigate()
    const [edu, setEdu] = useState('Matric')
    const { userDetail } = useSelector(e => e)
    const status = userDetail?.status
    const [exp, setExp] = useState(status !== "Student" ? 0 : "")
    const [expReq, setExpReq] = useState(false)
    // const [ showDetail, setShowDetail ] = useState(false)
    let show = false
    const [check, setCheck] = useState(false)
    const changeExp = (e) => {
        if (status == 'Student' && e.target.value.length <= 2)
            if ((e.target.value >= 0 && e.target.value <= 99) && !e.target.value.includes('-') && !e.target.value.includes('*') && !e.target.value.includes('/') && !e.target.value.includes('+') && !e.target.value.includes('e'))
                setExp(e.target.value)
        if (check) {
            setExpReq(e.target.value == "")
        }
    }
    const submit = () => {
        setCheck(true)
        if (exp == "" && exp.length == 0)
            setExpReq(true)
        else {
            let tempdata = { ...userDetail }
            tempdata.exp = exp
            tempdata.edu = edu
            setUserDetail(tempdata)
            set(ref(db, 'users/' + tempdata?.uid), {
                userDetail: tempdata
            })
                .then(() => {
                    setShowDetail(false)
                    // navigate('/')
                    // alert('test')
                    // <Router>
                    //     <Routes>
                    //         <Route path={'/'} element={<Navigate to={'/'} />}/>
                    //     </Routes>
                    // </Router>
                }
                    // setStReq(false)
                )
        }
    }


    // <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
    return (
        <form>
        <div style={{
            position: 'fixed', top: 0, left: 0, backgroundColor: 'rgb(100, 100, 100)', 
            width: '100vw', height: '100vh', opacity: '0.5', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
        </div>

        <div
        onClick={() => 
           setTimeout(() => {
           if(show == false)
           setShowDetail(false) },50)
       }
            className={'AllFeaturesNoPadding'}>
        <div 
        onClick={() => {
            // if(show == false)
                show = true 
                // if(show == true)
                setTimeout(() => { 
                    setShowDetail(true)
                    show = false
                },87)
        }} 
        className='AllFeaturesNoPadChildDiv'>

        {/* <div style={{
            width: '100%', display: 'flex', justifyContent: 'end',
            padding: '20px 20px 0 0', cursor: 'pointer'
        }} onClick={() => {
            setTimeout(() => {
                setShowDetail(false)
            }, 100)
        }}> */}

            {status == 'Student' ?
                <div style={{ backgroundColor: "white", boxShadow: '3px 3px 13px 10px rgba(0, 0, 0, 0.3)', padding: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                        <div style={{ cursor: 'pointer' }}  onClick={() => {
                                    setTimeout(() => {
                                        setShowDetail(false) },100)
                                }}>
                            <BiArrowBack />
                        </div>
                        <h2>Before apply you have to fill this</h2>
                    </div>
                    <div className='signUpRowDiv'>
                        <select className='signUpTextInput stReqSelect' value={edu} onChange={(e) => setEdu(e.target.value)}>
                            <option className='signUpOption stReqOption'>Matric</option>
                            <option className='signUpOption stReqOption'>Inter</option>
                            <option className='signUpOption stReqOption'>Bachelor</option>
                            <option className='signUpOption stReqOption'>Master</option>
                        </select>
                    </div>
                    <div className='signUpRowDiv'>
                        <input placeholder={'Experience:'} className='signUpTextInput stReqSelect' type='number' value={exp} onChange={(e) => changeExp(e)} />
                        {/* {expReq ? <p className="signUpError" style={{ fontSize: '16px', marginBottom: '20px' }}>Required!</p> : false} */}
                    </div>
                    <button onClick={submit} disabled={exp == ''} className={exp != '' ? "LogOutBut" : "LogOutBut signUpBgGray"} type="submit">Submit</button>
                </div>
                : false
            }
        </div>
        </div>
        {/* </div> */}
        </form>
    )
}
export default StudentReq