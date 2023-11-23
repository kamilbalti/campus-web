import { useState } from "react"
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs"

const Input = ({ email, passBorder, passType, setPassType, name, inputClass, formik, reqCheck, setReqCheck, err, setErr, si, setPassBorder, func, fp, setInputVal }) => {
    const [check, setCheck] = useState(false)
    const [check2, setCheck2] = useState(false)
    const hideLabel = (val) => {
        setCheck2(val)
        if ( (formik && formik?.values[name?.toLowerCase()]?.length != 0) || (fp && email?.length != 0))
            setCheck(true)
        else
            setCheck(val)
        if (passType)
            setPassBorder(val)
    }
    return (
        <div className='signUpRowDiv'>
            <div className={ !passType ? '' : passBorder ? 'signUpPassDiv signUpBorder' : 'signUpPassDiv'}>
                <input type={passType ? passType : name} onBlur={() => hideLabel(false)} onFocus={() => hideLabel(true)} name={name?.toLowerCase()} value={ formik ? formik?.values[name?.toLowerCase()] : email} onChange={(e) => {
                    let temp = { ...reqCheck }
                    temp[name.toLowerCase()] = e.target.value.length == 0
                    if(!si){
                        if(name == 'Email'){
                            let invEmail    =  e.target.value?.trim() != '' && (!e.target.value?.trim().includes('@') || !e.target.value?.trim().includes('.') || e.target.value?.trim()[e.target.value?.trim().length - 1] == '.' || e.target.value[e.target.value?.trim().length - 2] == '.' || e.target.value.includes('..') || e.target.value.split('@')[1][0] == '.')
                            temp['invEmail'] = invEmail;
                            temp['exist'] = false}
                        if(name == 'Password'){
                            temp['passlength'] = e.target.value.trim().length <= 7        
                        }
                        if(name == 'Name')
                            temp['Name'] = e.target.value.trim() == ''
                    }
                    setReqCheck(temp)
                    setErr(false)
                    if(formik)
                    formik.handleChange(e)
                    else
                    setInputVal(e.target.value)
                // }
                }} className={inputClass} />
                {passType ? <button type='button' className='signUpPassIcon' onClick={() => passType == 'password' ? setPassType('text') : setPassType('password')}>
                    {passType == 'password' ?
                        <BsFillEyeSlashFill /> : <BsFillEyeFill />}
                </button> : false}
                <label className={`label ${ fp && email?.length != 0 || check ? `labelHide ${ ((formik && formik?.values[name?.toLowerCase()]?.length != 0) || email?.length != 0) && !check2 ? "labelHide blackLabel" : ''}` : ''}`}>{name}</label>
            </div>
            {err && si ? <p className='signUpError'>Invalid Email or Password</p> : err}
        </div>
    )
}
export default Input