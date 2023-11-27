import { Box, Modal } from "@mui/material"

const ViewMore = ({ data, setData }) => {
    const handleClose = () => {
        setData(false)
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
        height: 'fit-content'
    };
    return (
        <Modal open={data} onClose={handleClose} aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description">
            <Box sx={style}>
                <div style={{width: '100%', margin: '0', boxShadow: 'none'}} className={
                    // applyInd == index && applyInd !== false ? "previousJobBox previousJobBox2" :
                    "previousJobBox"} 
                    // onClick={() => applyInd !== index && setApplyInd(index)}
                    >
                    <h1>{data?.jobDetail?.title}</h1>
                    <div>
                        <h3>Duration: {data?.jobDetail?.duration} {data?.jobDetail?.duration == 1 ? "Day" : "Days"}</h3>
                        <h3>Budget: ${data?.jobDetail?.salary}</h3>
                        <h3>
                            Description: <i>{data?.jobDetail?.description}</i>
                        </h3>
                    </div>
                    {/* <div style={{ display: 'flex', gap: '15px' }}>
                        <button className="postButton" onClick={() => Apply(item.indexes)}>Apply</button>
                    </div> */}
                </div>

            </Box>
        </Modal>

    )
}
export default ViewMore