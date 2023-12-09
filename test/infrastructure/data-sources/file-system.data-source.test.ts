import chai from 'chai';
import proxyquire from 'proxyquire';
import sinon, { SinonStub } from 'sinon';
const {expect} = chai;
import chaiAsPromise from 'chai-as-promised'
import fs from 'fs-extra';

import {Configuration} from "../../../src/core";
import {FileSystemDataSource} from "../../../src/infrastructure/data-sources";
import {configuration} from "../../fixtures";

chai.use(chaiAsPromise);

describe('FileSystemDataSource', () => {
    let fileSystemDataSource: FileSystemDataSource<Configuration>;
    let readJsonStub: SinonStub;
    let writeJsonStub: SinonStub;
    const testConfigFilePath = 'path/to/config.json';

    beforeEach(() => {
        readJsonStub = sinon.stub(fs, 'readJSON');
        writeJsonStub = sinon.stub(fs, 'writeJSON');

        const { FileSystemDataSource } = proxyquire('../../../src/infrastructure/data-sources', {
            'fs-extra': {
                readJSON: readJsonStub,
                writeJSON: writeJsonStub
            }
        });

        fileSystemDataSource = new FileSystemDataSource(testConfigFilePath);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should get the value from cache if available', async () => {
        readJsonStub.resolves(configuration)

        const value = await fileSystemDataSource.get('apiToken');

        expect(value).to.equal(configuration.apiToken);
        await fileSystemDataSource.get('apiToken');
        expect(readJsonStub.calledOnce).to.be.true;
    });

    it('should set the value and update both cache and file system', async () => {
        const initialData = {workspaceId: 42};
        const newData = {...initialData, apiToken: 'irrelevant'}
        readJsonStub.resolves(initialData);
        writeJsonStub.resolves();

        await fileSystemDataSource.set('apiToken', newData.apiToken);

        expect(writeJsonStub.calledOnceWith(testConfigFilePath, )).to.be.true;
        expect(await fileSystemDataSource.get('apiToken')).to.equal(newData.apiToken);
        expect(readJsonStub.calledOnce)
    });
});
