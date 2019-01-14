const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const server = express();

const projects = require('./data/helpers/projectModel.js');
const actions = require('./data/helpers/actionModel.js');

//MIDDLEWARE

server.use(morgan('short'));
server.use(helmet());
server.use(cors());
server.use(express.json());

const url = '/api/projects/';
const actionsurl = '/api/actions/';

server.get(url, async(req, res) => {
    try{
        const projectsData = await projects.get()
        res.status(200).json(projectsData)
    }catch(err){
        res.status(500).json(`{error: 'could not retrieve that route'}`)
    }
});

server.get(`${url}:id`, async(req, res) => {
    const { id } = req.params;
    try{
        const projectsData = await projects.get(id)
        if(projectsData.length === 0) {
            res.status(404).json(`{error: 'that user can be found'}`)
        } else {
            res.status(200).json(projectsData)
        }
    } catch(err){
        res.status(500).json(`{error: 'user info could not be found'}`)
    }
});

server.get(`${url}actions/:projectId`, async(req, res) => {
    const { projectId } = req.params;
    try{
        const projectActions = await projects.getProjectActions(projectId)
        if(projectActions.length === 0) {
            res.status(404).json(`{error: 'sorry wrong project ID'}`)
        } else {
            res.status(200).json(projectActions)
        }
    } catch(err) {
        res.status(500).json(`{error: 'Those actions could not be found'}`)
    }
});

server.post(`${url}`, async(req, res) => {
    const { name, description } = req.body;
    try{
        if(!name || !description){
            res.status(404).json(`{error: 'Please enter name and description'}`)
        } else if (name.length > 128) {
            res.status(404).json(`{error: 'Sorry that name is tooooooo looooonnnng'}`)
        } else {
            const data = await projects.insert({name, description})
            res.status(200).json(data)
        }
    } catch(err) {
        res.status(500).json(`{error: 'Bad request: Information not found'}`)
    }
});

server.put(`${url}:id`, async(req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { name, description } = req.body;
    try {
        const results = await projects.update(id, data)
        if(!name || !description) {
            res.status(404).json(`{error: 'Sorry, but the name and description are required'}`)
        } else if(name.length > 128) {
            res.status(404).json(`{error: 'Sorry that name is tooooooo looooonnnng'}`)
        } else {
            res.status(200).json(results)
        }
    } catch(err) {
        res.status(500).json(`{error: 'Sorry something went wrong'}`)
    }
});

server.delete(`${url}:id`, async(req, res) => {
    const { id } = req.params;
    projects.get(id)
    try{
        const user = await projects.remove(req.params.id)
        if(user){
            res.status(204).json(user)
        } else {
            res.status(404).json(`{error: 'Project with that id not found'}`)
        }
    } catch(err) {
        res.status(500).json(`{error: 'Sorry something went wrong'}`)
    }
});

//==========ACTIONS=============//

server.get(actionsurl, async(req, res) => {
    try{
        const actionsData = await actions.get()
        res.status(200).json(actionsData)
    }catch(err){
        res.status(500).json(`{error: 'could not retrieve that route'}`)
    }
});

server.get(`${actionsurl}:id`, async(req, res) => {
    const { id } = req.params;
    try{
        const actionsData = await actions.get(id)
        if(actionsData.length === 0) {
            res.status(404).json(`{error: 'that action cannot be found'}`)
        } else {
            res.status(200).json(actionsData)
        }
    } catch(err){
        res.status(500).json(`{error: 'action  could not be found'}`)
    }
});

server.post(`${actionsurl}`, async(req, res) => {
    const { project_id, description, notes } = req.body;
    try{
        if(!project_id || !description || !notes ){
            res.status(404).json(`{error: 'Please enter notes and description'}`)
        } else if (description.length > 128) {
            res.status(404).json(`{error: 'Sorry that description is tooooooo looooonnnng'}`)
        } else {
            const data = await actions.insert({project_id, description, notes})
            res.status(200).json(data)
        }
    } catch(err) {
        res.status(500).json(`{error: 'Bad request: Information not found'}`)
    }
});

server.put(`${actionsurl}:id`, async(req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { project_id, description } = req.body;
    try {
        const results = await actions.update(id, data)
        if(!project_id || !description) {
            res.status(404).json(`{error: 'Sorry, but the project id and description are required'}`)
        } else if(description.length > 128) {
            res.status(404).json(`{error: 'Sorry that description is tooooooo looooonnnng'}`)
        } else {
            res.status(200).json(results)
        }
    } catch(err) {
        res.status(500).json(`{error: 'Sorry something went wrong'}`)
    }
});

server.delete(`${actionsurl}:id`, async(req, res) => {
    const { id } = req.params;
    actions.get(id)
    try{
        const user = await actions.remove(req.params.id)
        if(user){
            res.status(204).json(user)
        } else {
            res.status(404).json(`{error: 'actions with that id not found'}`)
        }
    } catch(err) {
        res.status(500).json(`{error: 'Sorry something went wrong'}`)
    }
});
module.exports = server

