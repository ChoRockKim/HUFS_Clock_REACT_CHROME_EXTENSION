import './SkeletonUI.scss'

export default function SkeletonUI() {
    return(
 
       <div className='Notice-table-container-skeleton'>
        <div className='skeleton' style={{width:'100%', height:'15%',
            marginBottom:'25px'
        }}></div>
        <div style={{display:'flex', flexDirection:'column',
            height: '80%%', justifyContent: 'space-evenly'
        }}>
            {[1,2,3,4,5].map(()=>{
                return(
                <div className='skeleton' style={{width:'100%', height:'50px',
                marginBottom:'10px'
            }}></div>
                )
            })
}
            </div>
        </div>
    )
}
