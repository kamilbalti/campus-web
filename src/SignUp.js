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
    // const [email, setEmail] = useState("")
    // const [password, setPassword] = useState("")
    // const [ name, setName ] = useState("")
    const [ status, setStatus ] = useState("Student")
    const [ edu, setEdu ] = useState('Matric')
    const [ exp, setExp ] = useState(0)
    const navigate = useNavigate()
    const [ AllUsersData, setAllUsersData ] = useState([])
    const [ index, setIndex ] = useState(false)
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
        CreateUser()
        console.log(values)
    }
    })


    const CreateUser = () => {
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
            alert(err)
            dispatch(setUserDetail(false))
        })
    }
    return(
        <div className="signUpMainDiv">
            <form onSubmit={(e) => formik.handleSubmit(e)} className="signUpDiv">
                <h1>Sign Up</h1>
                <div className='signUpRowDiv'>
                    <h2 className='signUpIntroName'>Name:</h2>
                    <input name='name' value={formik.values.name} onChange={formik.handleChange} className='signUpTextInput'/>
                </div>
                <div className='signUpRowDiv'>
                    <h2 className='signUpIntroName'>Status:</h2>
                    <select className='signUpSelect signUpTextInput' value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option className='signUpOption'>Student</option>
                        <option className='signUpOption'>Company</option>
                        {index !== false && index? <option className='signUpOption'>Admin</option> : false}
                    </select>
                </div>{status == 'Student' ?
                    <div className='signUpRow2'>
                    <h2 className='signUpIntroName'>Qualification:</h2>
                        <select className='signUpTextInput signUpSelect signUpEdu' value={edu} onChange={(e) => setEdu(e.target.value)}>
                            <option className='signUpOption'>Matric</option>
                            <option className='signUpOption'>Inter</option>
                            <option className='signUpOption'>Bachelor</option>
                            <option className='signUpOption'>Master</option>
                        </select>
                        <div className='signUpRowDiv'>
                            <h2 className='signUpIntroName'>Experience: (Y)</h2>
                            <input className='signUpTextInput' type='number' value={exp} onChange={(e) => e.target.value >= 0 ? setExp(e.target.value) : false} />
                        </div>
                    </div>: false}
                <div className='signUpRowDiv'>
                    <h2 className='signUpIntroName'>Email:</h2>
                    <input name='email' value={formik.values.email} onChange={formik.handleChange} className='signUpTextInput'/>
                </div>
                <div className='signUpRowDiv'>
                    <h2 className='signUpIntroName'>Password:</h2>
                    <input name='password' value={formik.values.password} onChange={formik.handleChange} type='password' className='signUpTextInput'/>
                </div>
                {/* <Link to={'/'}> */}
                <button className='signUpButton' type='submit'>Sign Up</button>
                {/* </Link> */}
            <p>Already have an account <Link to={'/'}>Sign in</Link></p>
            </form>
        </div>
    )
}
export default SignUp