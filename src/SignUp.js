// import * as Yup from 'yup'
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth'
import { onValue, ref, set } from 'firebase/database'
import './SignUp.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserArr, setUserDetail } from './Redux-Toolkit/BazarSlice';
import { app, db } from "./firebase"
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup'
const SignUp = () => {
    const dispatch = useDispatch() 
    const auth = getAuth(app);
    const [ next, setNext ] = useState(false)
    // const [email, setEmail] = useState("")
    // const [password, setPassword] = useState("")
    // const [ name, setName ] = useState("")
    const [ status, setStatus ] = useState("Student")
    const [ edu, setEdu ] = useState('Matric')
    const [ exp, setExp ] = useState(status == "Student"? 0 :"")
    const navigate = useNavigate()
    const [ AllUsersData, setAllUsersData ] = useState([])
    const [ check, setCheck ] = useState(false)
    const [ index, setIndex ] = useState(false)
    const [reqCheck, setReqCheck] = useState({name: false, email: false, password: false, passlength: false, emaillength: false, exp: false})
    const [err, setErr] = useState(false)
    const validationSchema = Yup.object().shape({
        email: Yup.string()
          .email('Invalid email address')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
        name: Yup.string()
        .required('Name is required')
        .matches(/^[a-zA-Z\s'-]+$/, 'Invalid name format')
      });
    useEffect(() => {
        onValue(ref(db,"users/"),(data) => {
            let temp = [...AllUsersData]
            data.val() && Object.values(data.val()).map((item,index) => 
            temp.push(item?.userDetail)
            )
            setAllUsersData(temp)
            setIndex(temp.findIndex((item, index) => item?.status == "Admin"))
        })
    },[])
    const formik = useFormik({
        initialValues:{
        name: "",
        email: "",
        password: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
        // setCheck(true)
        // let temp = {...reqCheck}
        // if(formik.values.email == "") {
        //     temp.email = true;
        // }
        // else if(formik.values.email.length < 8)
        //     temp.emaillength = true
        // if(formik.values.password == "") {
        //     temp.password = true;
        // }
        // else if(formik.values.password.length < 8)
        //     temp.passlength = true
        // else
        // CreateUser(values)
        // setReqCheck(temp)
    }
    })


    const CreateUser = () => {
        setCheck(true)
        // alert(true)
        // setExp(0)
        let temp = {...reqCheck}
        if(formik.values.email == "") {
            temp.email = true;
            setReqCheck(temp)
            setErr(false)
        }
        else if(formik.values.email.length < 8)
        temp.emaillength = true
    if(formik.values.password == "") {
        temp.password = true;
        setReqCheck(temp)
        setErr(false)
    }
    else if(formik.values.password.length < 8){
        temp.passlength = true
        setReqCheck(temp)
        setErr(false)
    }
    if(exp == "" && exp.length == 0)
    temp.exp = true
    else if(!temp.email && !temp.emaillength && !temp.password && !temp.passlength){
        // if((temp.exp && status !== 'Student') || !temp.exp )
        
        // let tempUserDetail = {name, status, email, password}
        createUserWithEmailAndPassword(auth, formik.values.email, formik.values.password).then(async(res) => {
            let userId = res?.user?.uid
            let userDetail = { name: formik.values.name, status, 
            email: formik.values.email, password: formik.values.password, 
            uid: res?.user?.uid, block: false, verify: false,
            exp: status == "Student"  ? exp : false, edu: status == "Student"  ? edu : false 
        }
        dispatch(setUserDetail(userDetail))
            await set(ref(db, 'users/' + userId), {
                userDetail
            })
            navigate('/')
        }).catch((err) => {
            setErr(err)
              // alert(err)
            dispatch(setUserDetail(false))
        })}
    }
    const nextFunc = () => {
        let temp = {...reqCheck}
        setNext(false)
        if(formik.values.name == "") {
            temp.name = true;
            setReqCheck(temp)
            setErr(false)
        }
        else{
            setNext(true)
        }
    }
    const changeExp = (e) => {
        if(status == 'Student'){
        if(e.target.value == "")
            setExp(0) 
        else if(e.target.value >= 0)
            setExp(e.target.value)
        let temp = {...reqCheck}
        if(check){
            temp.exp = exp == "" && exp !== 0 
        }
        setReqCheck(temp)}
        setErr(false)
    }
    return(
        <div className="signUpMainDiv">
            <>
                {
                    !next ? <form onSubmit={(e) => formik.handleSubmit(e)} className="signUpDiv">
                    <h1>Sign Up</h1>
                    <div className='signUpRowDiv'>
                    <input placeholder={'Name:'} name='name' value={formik.values.name} onChange={(e) => {
                            let temp = {...reqCheck}
                            if(check)
                            temp.name = e.target.value.length == 0
                            setReqCheck(temp)
                            setErr(false)
                            formik.handleChange(e)
                        }} className='signUpTextInput'/>
                        {reqCheck.name? <p>Required!</p> : false}
                </div>
                <div className='signUpRowDiv'>
                    <select className='signUpSelect signUpTextInput' value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option className='signUpOption'>Student</option>
                        <option className='signUpOption'>Company</option>
                        {index == false ? <option className='signUpOption'>Admin</option> : false}
                    </select>
                </div>{status == 'Student' ?
                    // <>
                    <div className='signUpRowDiv'>
                        <select className='signUpTextInput signUpSelect' value={edu} onChange={(e) => setEdu(e.target.value)}>
                            <option className='signUpOption'>Matric</option>
                            <option className='signUpOption'>Inter</option>
                            <option className='signUpOption'>Bachelor</option>
                            <option className='signUpOption'>Master</option>
                        </select>
                    </div>
                    : false}
                    <button className='signUpButton' type='submit' onClick={nextFunc}>Next</button>
                    <p>Already have an account <Link to={'/'}>Sign in</Link></p>
                    </form> :
                    <form onSubmit={(e) => formik.handleSubmit(e)} className="signUpDiv">
                    <h1>Sign Up</h1>
                    { status == "Student"?
                        <div className='signUpRowDiv'>
                            <input placeholder={'Experience:'} className='signUpTextInput' type='number' value={exp} onChange={(e) => changeExp(e)} />
                        {reqCheck.exp? <p>Required!</p> : false}
                        </div>
                        // </>
                    : false}
                    <div className='signUpRowDiv'>
                    <input placeholder={'Email:'} name='email' value={formik.values.email} onChange={(e) => {
                            let temp = {...reqCheck}
                            if(check){
                            temp.email = e.target.value.length == 0
                            temp.emaillength = e.target.value.length < 8}
                            setReqCheck(temp)
                            setErr(false)                        
                            formik.handleChange(e)}
                        } className='signUpTextInput'/>
                    {reqCheck.email? <p>Required!</p> : reqCheck.emaillength? <p>Minimum 8 character required!</p> : false}
                </div>
                <div className='signUpRowDiv'>
                    <input placeholder={'Password:'} name='password' value={formik.values.password} onChange={(e) => {
                        let temp = {...reqCheck}
                        if(check){
                        temp.password = e.target.value.length == 0
                        temp.passlength = e.target.value.length < 8}
                        setReqCheck(temp)
                        setErr(false)                                                
                        formik.handleChange(e)
                        }} type='password' className='signUpTextInput'/>
                    {reqCheck.password? <p>Required!</p> : reqCheck.passlength? <p>Minimum 8 character required!</p> : err ? <p>Account already exist</p> : false}
                </div>
                <button onClick={CreateUser} className='signUpButton' type='submit'>Sign Up</button>
                <p>Already have an account <Link to={'/'}>Sign in</Link></p>
                </form>
                }
            </>
        </div>
    )
}
export default SignUp