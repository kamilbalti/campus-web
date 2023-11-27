import { useState } from "react"
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs"

const Input = ({ err, setErr
    // , email
    , type, name, inputClass, formik
    // , fp
    , setInputVal }) => {
    const [passBorder, setPassBorder] = useState(false)
    const [check, setCheck] = useState(false)
    const [ passType, setPassType ] = useState('password')
    const [check2, setCheck2] = useState(false)
    const hideLabel = (val) => {
        setCheck2(val)
        if ( (formik && formik?.values[name?.toLowerCase()]?.length != 0)
        //  || (fp && email?.length != 0)
        )
            setCheck(true)
        else
            setCheck(val)
        if (type)
            setPassBorder(val)
    }
    return (
        <div className='signUpRowDiv'>
            <div className={ !type ? '' : passBorder ? 'signUpPassDiv signUpBorder' : 'signUpPassDiv'}>
                <input type={type ? passType : 'text'} onBlur={() => hideLabel(false)} onFocus={() => hideLabel(true)} name={name?.toLowerCase()} value={ formik?.values[name?.toLowerCase()] } onChange={(e) => {
                    if(formik)
                    formik.handleChange(e)
                    else
                    setInputVal(e.target.value)
                // }
                    // formik.values.email.length > 5 && 
                    // exist && setExist(e.target.value == exist)
                    err && name == 'Email' && setErr(false)
                }} className={inputClass} />
                {type ? <button type='button' className='signUpPassIcon' onClick={() => passType == 'password' ? setPassType('text') : setPassType('password')}>
                    {passType == 'password' ?
                        <BsFillEyeSlashFill /> : <BsFillEyeFill />}
                </button> : false}
                <label className={`label ${ 
                    // fp && email?.length != 0 || 
                    check ? `labelHide ${ ((formik && formik?.values[name?.toLowerCase()]?.length != 0)
                    //  || email?.length != 0
                     ) && !check2 ? "labelHide blackLabel" : ''}` : ''}`}>{name}</label>
            </div>
            {<p className='signUpError'>{ formik?.values?.hasOwnProperty(name.toLowerCase()) && 
            formik?.values[name.toLowerCase()].trim() != '' ? 
                formik?.errors?.hasOwnProperty(name.toLowerCase()) && formik?.errors[name.toLowerCase()] : 
                false
                }</p>}
        </div>
    )
}
export default Input