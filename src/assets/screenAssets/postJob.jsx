import '../../auth/SignUp.css'
import { onValue, ref, set } from "firebase/database"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { db } from "../../Firebase/firebase"

const PostJob = ({ tempInd, setTempInd, setSelect, title, setTitle, duration, setDuration, salary, setSalary, description, setDescription }) => {
    const { userDetail } = useSelector(e => e)
    const [allCheck, setAllCheck] = useState(false)
    const [check, setCheck] = useState(false)
    let tempIndex = 0
    if(window.location.pathname.split('/')[1] == 'Job')
    setSelect(2)
    const uid = userDetail?.uid
    useEffect(() => {
        let temp = description.trim().split(" ")

        onValue(ref(db, "AllJobs/" + uid + "/job/"), async (data) => {
            tempIndex = data?.val() ? data?.val()?.length : 0
        })
    })
    useEffect(() => {
        if (title.trim() != "" && duration != "" && salary && description.trim() != "") {
            setAllCheck(true)
        }
        else {
            setAllCheck(false)
        }
    }, [title, duration, salary, description])
    const addJob = () => {
        setCheck(true)
        if (title.trim() != "" && duration != "" && salary != "" && description.trim() != "") {
            setAllCheck(true)
        }
        else {
            setAllCheck(false)
        }
        if (allCheck) {
            onValue(ref(db, "AllJobs/" + uid + "/job/"), async (data) => {
                tempIndex = data.val() ? data.val().length : 0
                setTitle("")
                setDuration("")
                setSalary("")
                setDescription("")
                setAllCheck(false)
                setSelect(1)
            })
            set(ref(db, "AllJobs/" + uid + "/job/" + tempIndex + "/jobDetail"), {
                title,
                duration,
                salary,
                description,
                uid,
                verify: true,
                block: false,
            })
            // setIndex(index+1)
        }
    }
    const updateJob = () => {
        setCheck(true)
        let tempData
        if (title.trim() != "" && duration != "" && salary != "" && description.trim() != "") {
            setAllCheck(true)
        }
        else {
            setAllCheck(false)
        }
        if(allCheck){
        onValue(ref(db, 'AllJobs/' + uid + '/job/' + tempInd + '/jobDetail'), (data) => {
            tempData = { ...data.val() }
        })
        setAllCheck(false)
        tempData.description = description
        tempData.duration = duration
        tempData.salary = salary
        tempData.title = title
        tempData.uid = uid
        set(ref(db, "AllJobs/" + uid + "/job/" + tempInd), {
            jobDetail: tempData,
        })
        setTempInd(false)
        setSelect(1)
        setTitle("")
        setDuration("")
        setSalary("")
        setDescription("")
    }
}
    return (
        <div className="postJobDiv">
            <div className="postJobChildDiv">
                <input placeholder="Title Of Job :" value={title} onChange={(e) =>
                    (e.target.value.length <= 20 || e.target.value.length <= title.length) ? setTitle(e.target.value) : false
                }
                    className="signUpTextInput" />
            </div>
            <div className="postJobChildDiv">
                <input placeholder="Duration of Job : " value={duration} onChange={(e) =>
                    e.target.value >= 0 && e.target.value.length <= 22 ? setDuration(e.target.value) : false
                }
                    type="number" className="signUpTextInput" />
            </div>
            <div className="postJobChildDiv">
                <input placeholder="Salary :" type="number" value={salary} onChange={(e) =>
                    e.target.value >= 0 && e.target.value.length <= 22 ? setSalary(e.target.value) : false
                }
                    className="signUpTextInput" />
            </div>
            <div className="postJobChildDiv">
                <textarea placeholder="Description:" value={description} onChange={(e) =>
                    e.target.value.length >= 500 && e.target.value.length >= description.length ? false : setDescription(e.target.value)
                }
                    className="postJobText" />
            </div>
            {
                !allCheck && check ?
                    <div className="">
                        <p className="postjobpara">All the fields are required</p>
                    </div>
                    : false}
            <div className="postJobChildDiv">
                {
                    tempInd !== false ?
                        <button className="postButton" onClick={updateJob}>Update Job</button> :
                        <button className="postButton" onClick={addJob}>Add Job</button>
                }
            </div>
        </div>
    )
}
export default PostJob