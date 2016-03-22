<?php

$remoteTree = Emergence::resolveCollectionFromParent('/', true);

MICS::dump($remoteTree, 'remote tree');