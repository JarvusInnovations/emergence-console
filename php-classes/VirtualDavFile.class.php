<?php

class VirtualDavFile extends SiteFile implements Sabre_DAV_IFile, Sabre_DAV_INode
{
    static public $localizedAncestorThreshold = 3600;

	// localize all changes
	function put($data, $ancestorID = NULL)
	{
		if ($this->Collection->Site == 'Local') {
			$newRecord = parent::put($data, $ancestorID);
			
#			header('x-vfs-last-id: '.$ancestorID);
			header('x-vfs-id: '.$newRecord['ID']);
				
			return $newRecord;
		} else {
			$localCollection = $this->Collection->getLocalizedCollection();
			
			if ($localFile = $localCollection->getChild($this->Handle)) {
				if ($localFile->AuthorID == $GLOBALS['Session']->PersonID && $localFile->Timestamp > (time()-static::$localizedAncestorThreshold)) {
					$ancestorID = $localFile->ID;
				} else {
					$ancestorID = $this->ID;
				}
				
				$newRecord = $localFile->put($data, $ancestorID);
				
#				header('x-vfs-last-id: '.$ancestorID);
				header('x-vfs-id: '.$newRecord['ID']);
				
				return $newRecord;
			} else {
				return $localCollection->createFile($this->Handle, $data, $this->ID);
			}
		}
	}
	
	static public function getByHandle($collectionID, $handle)
	{
		if ($_SERVER['REQUEST_METHOD'] == 'GET' && !empty($_SERVER['HTTP_X_REVISION_ID'])) {
			return static::getByID($_SERVER['HTTP_X_REVISION_ID']);
		} else {
			return parent::getByHandle($collectionID, $handle);
		}
	}
}
