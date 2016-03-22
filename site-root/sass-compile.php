<?php

$GLOBALS['Session']->requireAccountLevel('Developer');
set_time_limit(0);
Benchmark::startLive();

// set paths
$sassPath = "site-root/sass";
$imgPath = "site-root/img";

// get temporary directory and set paths
$tmpPath = Emergence_FS::getTmpDir();
$sassTmpPath = "$tmpPath/sass";
$imgTmpPath = "$tmpPath/img";
$cssTmpPath = "$tmpPath/css";

Benchmark::mark("created tmp: $tmpPath");

// grab resources to work with
$exportResult = Emergence_FS::exportTree($sassPath, $sassTmpPath);
Benchmark::mark("exported $sassPath to $sassTmpPath: ".http_build_query($exportResult));

$exportResult = Emergence_FS::exportTree($imgPath, $imgTmpPath);
Benchmark::mark("exported $imgPath to $imgTmpPath: ".http_build_query($exportResult));

// begin cmd
chdir($sassTmpPath);
Benchmark::mark("chdir to: $sassTmpPath");

$cmd = '/usr/local/bin/compass compile';
Benchmark::mark("running CMD: $cmd");

passthru($cmd, $cmdStatus);
Benchmark::mark("CMD finished: exitCode=$cmdStatus");

// import build
if($cmdStatus == 0)
{
	Benchmark::mark("importing $cssTmpPath");
	
	$filesImported = Emergence_FS::importTree($cssTmpPath, "site-root/css");
	Benchmark::mark("imported $filesImported files");
}

// clean up
if(empty($_GET['leaveWorkspace']))
{
	exec("rm -R $tmpPath");
	Benchmark::mark("erased $tmpPath");
}