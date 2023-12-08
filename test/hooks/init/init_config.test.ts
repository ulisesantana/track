/* eslint-disable unicorn/filename-case */
import {expect, test} from '@oclif/test'

describe('hooks', () => {
    test
        .stdout()
        .hook('init', {id: 'mycommand'})
        .do(output => expect(output.stdout).to.contain('example hook running mycommand'))
        .skip()
        .it('shows a message')
})
