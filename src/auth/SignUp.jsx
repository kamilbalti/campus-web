import blueImgSrc from '../photos/campus_image_blue.png'
import AuthLeftSide from './AuthLeftSide';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { onValue, ref, set } from 'firebase/database'
import './SignUp.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUnSub, setUserDetail } from '../Redux-Toolkit/BazarSlice';
import { app, db } from "../Firebase/firebase"
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { TailSpin } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import Input from '../assets/screenAssets/input/Input';
import { MenuItem, Select } from '@mui/material';
const SignUp = () => {
    const { userDetail } = useSelector((e) => e)
    const [ err, setErr ] = useState(false)
    const dispatch = useDispatch()
    const auth = getAuth(app);
    const [status, setStatus] = useState("Student")
    const navigate = useNavigate()
    const [AllUsersData, setAllUsersData] = useState([])
    const [wait, setWait] = useState(false)
    // const [reqCheck, setReqCheck] = useState(false)
    const [condition, setCondition] = useState(true)
    const statusArr = ['Student', 'Company']
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .max(35, 'Email must be at most 35 characters')
            .required('Email is required')
            // .matches(/^[a-zA-Z0-9\s']+.@+/, 'Invalid email address')
            .matches(/[.]/, 'Invalid email address')
            ,
            password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
            name: Yup.string()
            .required('Name is required')
            .matches(/^[a-zA-Z0-9\s']+$/, 'Invalid name format')
    });
    useEffect(() => {
        onValue(ref(db, "users/"), (data) => {
            let temp = [...AllUsersData]
            data.val() && Object.values(data.val()).map((item, index) => temp.push(item?.userDetail))
            setAllUsersData(temp)
        })
    }, [])
    useEffect(() => {
        if (userDetail && (userDetail != 'loading' || userDetail != 'loading2') && userDetail?.verify)
            navigate('/')
        else navigate('/signUp')
    }, [userDetail])
    const formik = useFormik({
        initialValues: { name: "", email: "", password: "" },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            CreateUser(values)
        }
    })
    useEffect(() => {
        Object.values(formik.values)?.map((item2) => {
            if (formik.errors && item2 != '') {
                setCondition(false)
                Object.values(formik.errors)?.map((item) => {
                    if (item2)
                        setCondition(item)
                })
            }
            else
                setCondition(true)
        })
    }, [formik])

    // const checkEmail = (email) => {
    //     let temp2 = { ...reqCheck }
    //     temp2.exist = false
    //     setReqCheck(temp2)
    //     onValue(ref(db, "users/"), (data) => {
    //         let temp = [...AllUsersData]
    //         data.val() && Object.values(data.val()).map((item, index) => temp.push(item?.userDetail))
    //         let index2 = temp.findIndex((item3, index3) => item3?.email == email)
    //         index2 == -1 ?
    //             temp2.exist = false : temp2.exist = true
    //         setReqCheck(temp2)
    //     })
    // }
    const CreateUser = () => {
        try {
            if (!wait) {
                setWait(true)
                createUserWithEmailAndPassword(auth, formik.values.email.trim(), formik.values.password.trim())
                .then(async (res) => {
                    let userId = res?.user?.uid
                    let userDetail = {
                        name: formik.values.name, status, email: formik.values.email,
                        uid: res?.user?.uid, block: false, verify: false
                    }
                    dispatch(setUserDetail(userDetail))
                    setWait(false)
                    await set(ref(db, 'users/' + userId), { userDetail }).then(() => {
                        setWait(true)
                        dispatch(setUnSub(false))
                        // if (userDetail?.status == 'Admin')
                        //     navigate('/')
                        // else 
                        navigate('/logIn')
                    })
                }).catch((error) => {
                    if(Object.values(error)[0])
                    setErr(Object.values(error)[0])
                    notify(Object.values(error)[0])
                    setWait(false)
                    dispatch(setUserDetail(false))
                })
                // }
            }
            else {
                setWait(false)
            }
        }
        catch (err) {
            setWait(false)
        }
    }
    const notify = (error) => toast(error)

    console.log(formik.errors)
    return (
        <div className="signUpMainDiv">
            <>
                <ToastContainer />
                {
                    <form onSubmit={(e) => formik.handleSubmit(e)} className="signUpForm">
                        <img className='signUpHideImage' width={'60px'} height={'60px'} src={blueImgSrc} />
                        <div className='signUpDiv signUpChildDiv'>
                            <h1 style={{ width: '100%', textAlign: 'start', padding: '0 5px' }}>REGISTER</h1>
                            <Input name={'Name'} inputClass={'signUpTextInput'} su={true} formik={formik}
                            />
                            <div className='signUpRowDiv signUpSelect signUpTextInput'>
                                <Select
                                    className='signUpSelect2'
                                    defaultValue='role' value={status}
                                    onChange={(e) => setStatus(e.target.value)}>
                                    {statusArr?.map((item) =>
                                        <MenuItem value={item} className='signUpOption'>{item}</MenuItem>
                                    )}
                                </Select>
                            </div>
                            <Input err={err} setErr={setErr} name={'Email'} formik={formik} inputClass={'signUpTextInput'} su={true}/>
                            <Input type={'pass'} name={'Password'} inputClass={`signUpTextInput signUpPassInput`} 
                            su={true} formik={formik} 
                            />
                            <button
                                disabled={condition || err}
                                className={condition || err ? 'signUpButton signUpBgGray' : 'signUpButton'}
                                type='submit'>
                                {!wait ? 'Create Account' :
                                    <TailSpin height="15" width="15" color="#4fa94d" ariaLabel="tail-spin-loading"
                                        radius="1" wrapperStyle={{}} wrapperClass="" visible={true} />
                                }
                            </button>
                            <p>Already have an account <Link to={'/'}>Sign in</Link></p>
                        </div>
                        <AuthLeftSide />
                    </form>
                }
            </>
        </div>
    )
}
export default SignUp