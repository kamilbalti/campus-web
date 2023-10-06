import { useState } from "react"
import { useSelector } from "react-redux"
import { setUserDetail } from "./Redux-Toolkit/BazarSlice"
import { ref, set } from "firebase/database"
import { db } from "./firebase"

const StudentReq = ({setStReq}) => {
    const [ edu, setEdu ] = useState('Matric')
    const {userDetail} = useSelector(e => e)
    const status = userDetail?.status
    const [ exp, setExp ] = useState(status !== "Student"? 0 :"")
    const [expReq, setExpReq] = useState(false)
    const [check, setCheck] = useState(false)
    const changeExp = (e) => {
        if(status == 'Student'){
        if(e.target.value >= 0)
            setExp(e.target.value)
        if(check){
            setExpReq(e.target.value == "")
        }
    }
    }
    const submit = () => {
        setCheck(true)
        if(exp == "" && exp.length == 0)
        setExpReq(true)
        else{
            let tempdata = {...userDetail}
            tempdata.exp = exp
            tempdata.edu = edu
            setUserDetail(tempdata)
            set(ref(db, 'users/' + tempdata?.uid), {
                userDetail: tempdata
            }).then(() => {
                setStReq(false)
            })
        }
    }


    return(
        <div>

        {status == 'Student' ?
                    <div style={{border: '1px solid black', backgroundColor: "white", boxShadow: '3px 3px 13px 10px rgba(0, 0, 0, 0.3)', padding: '30px', borderRadius: '50px'}}>
                    <h1>Before apply you have to fill this</h1>
                    <div className='signUpRowDiv'>
                        <select className='signUpTextInput stReqSelect' value={edu} onChange={(e) => setEdu(e.target.value)}>
                            <option className='signUpOption'>Matric</option>
                            <option className='signUpOption'>Inter</option>
                            <option className='signUpOption'>Bachelor</option>
                            <option className='signUpOption'>Master</option>
                        </select>
                    </div>
                        <div className='signUpRowDiv'>
                            <input placeholder={'Experience:'} className='signUpTextInput stReqSelect' type='number' value={exp} onChange={(e) => changeExp(e)} />
                        {expReq? <p style={{marginBottom: '20px'}}>Required!</p> : false}
                        </div>
                        <button className="LogOutBut" onClick={submit}>Submit</button>
                        </div>
                    : false
                }
        </div>
    )
}
export default StudentReq