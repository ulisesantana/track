import { expect } from 'chai';
import sinon from 'sinon';

import {NullProject, Project} from "../../../src/core";
import {TogglApi} from "../../../src/infrastructure/data-sources";
import {ProjectRepositoryImplementation} from "../../../src/infrastructure/repositories";
import {buildProject, buildTogglProject} from "../../builders";

describe('ProjectRepositoryImplementation', () => {
    let repository: ProjectRepositoryImplementation;
    let apiMock: sinon.SinonStubbedInstance<TogglApi>;

    beforeEach(() => {
        apiMock = sinon.createStubInstance(TogglApi);
        repository = new ProjectRepositoryImplementation(apiMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should correctly map TogglProject to Project', () => {
        const togglProject = buildTogglProject()
        const project = ProjectRepositoryImplementation.mapToProject(togglProject);

        expect(project).to.be.an.instanceof(Project);
        expect(project).to.deep.equal(buildProject(togglProject));
    });

    it('should correctly map missing project to NullProject', () => {
        const project = ProjectRepositoryImplementation.mapToProject(null);

        expect(project).to.be.an.instanceof(NullProject);
        expect(project).to.deep.equal(new NullProject());
    });


    it('should correctly retrieve a project by ID', async () => {
        const mockProject = buildTogglProject({ id: 100, name: 'Test Project' });
        apiMock.getProjectById.resolves(mockProject);

        const result = await repository.getProjectById(mockProject.id);

        expect(apiMock.getProjectById.calledOnceWith(mockProject.id)).to.be.true;
        expect(result).to.be.deep.equal(buildProject(mockProject));
    });

    it('should correctly retrieve a project by name', async () => {
        const mockProjects = [buildTogglProject({ id: 1, name: 'Test Project' }), buildTogglProject({ id: 2, name: 'Another Project' })];
        apiMock.getProjects.resolves(mockProjects);

        const result = await repository.getProjectByName('Test Project');

        expect(apiMock.getProjects.calledOnce).to.be.true;
        expect(result).to.be.deep.equal(buildProject(mockProjects[0]));
    });

    it('should return a NullProject if project is not found by name', async () => {
        const mockProjects = [buildTogglProject({ id: 1, name: 'Test Project' }), buildTogglProject({ id: 2, name: 'Another Project' })];
        apiMock.getProjects.resolves(mockProjects);

        const result = await repository.getProjectByName('Not exist');

        expect(apiMock.getProjects.calledOnce).to.be.true;
        expect(result).to.be.an.instanceof(NullProject);
        expect(result).to.be.deep.equal(new NullProject());
    });

    it('should retrieve all projects', async () => {
        const mockProjects = [buildTogglProject({ id: 1, name: 'Test Project' }), buildTogglProject({ id: 2, name: 'Another Project' })];
        apiMock.getProjects.resolves(mockProjects);

        const result = await repository.getProjects();

        expect(apiMock.getProjects.calledOnce).to.be.true;
        expect(result.length).to.equal(mockProjects.length);
        expect(result).to.be.deep.equal(mockProjects.map(p => buildProject(p)));
    });

});
