const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use((req,res,next)=>{

    res.locals.totalComplaints = 0;
    res.locals.pendingComplaints = 0;
    res.locals.solvedComplaints = 0;

    next();

});

app.use(express.urlencoded({ extended:true }));

app.use(express.static('public'));

app.set('view engine', 'ejs');

/* DATABASE CONNECT */

mongoose.connect(
'mongodb://127.0.0.1:27017/smartVillageDB'
)

.then(() => {

    console.log('MongoDB Connected');

})

.catch((err) => {

    console.log(err);

});

/* SCHEMA */

const complaintSchema = {

    name:String,

    village:String,

    contact:String,

    issue:String,

    cspTopic:String,

    status:String,

    remarks:String,

    evidence:String,

    date:String

};

const Complaint = mongoose.model(
    'Complaint',
    complaintSchema
);

/* HOME PAGE */

app.get('/', async (req, res) => {

    const complaints = await Complaint.find().lean();

    const totalComplaints = complaints.length;

    const solvedComplaints = complaints.filter(
        c => c.status === "Solved"
    ).length;

    const pendingComplaints = complaints.filter(
        c => c.status === "Pending"
    ).length;

    res.render('index', {

        complaints: complaints,
        totalComplaints: totalComplaints,
        solvedComplaints: solvedComplaints,
        pendingComplaints: pendingComplaints

    });

});

/* ADD COMPLAINT */

app.post('/', async (req, res) => {

    const newComplaint = new Complaint({

        name: req.body.name,

        village: req.body.village,

        contact: req.body.contact,

        issue: req.body.issue,

        cspTopic: req.body.cspTopic,

        status: req.body.status,

        remarks: req.body.remarks,

        evidence: req.body.evidence,

        date:new Date().toLocaleString()

    });

    await newComplaint.save();

    res.redirect('/');

});

/* DELETE */

app.get('/delete/:id', async (req,res) => {

    console.log("DELETE ID:", req.params.id);

    await Complaint.findByIdAndDelete(
        req.params.id
    );

    res.redirect('/');

});
/* SOLVE */

app.get('/solve/:id', async (req,res) => {

    await Complaint.findByIdAndUpdate(

        req.params.id,

        {
            status:"Solved"
        }

    );

    res.redirect('/');

});
/* SERVER */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});