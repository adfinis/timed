import { setApplication } from "@ember/test-helpers";
import { start, setupEmberOnerrorValidation } from "ember-qunit";
import { loadTests } from "ember-qunit/test-loader";
import setupSinon from "ember-sinon-qunit";
import * as QUnit from "qunit";
import { setup } from "qunit-dom";

import Application from "timed/app";
import config from "timed/config/environment";

setApplication(Application.create(config.APP));

setup(QUnit.assert);

setupSinon();

setupEmberOnerrorValidation();
loadTests();
start();
