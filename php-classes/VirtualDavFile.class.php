<?php

class VirtualDavFile extends SiteFile implements Sabre_DAV_IFile, Sabre_DAV_INode
{
    static public $localizedAncestorThreshold = 3600;

	// localize all changes
	function put($data)
	{	
		if($this->Collection->Site == "Local")
		{
			$revisionData = parent::put($data);
		}
		else
		{
			$localCollection = $this->Collection->getLocalizedCollection();
			
			if($localFile = $localCollection->getChild($this->Handle))
			{
				if($localFile->AuthorID == $GLOBALS['Session']->PersonID && $localFile->Timestamp > (time()-static::$localizedAncestorThreshold))
				{
					$ancestorID = $localFile->ID;
				}
				else
				{
					$ancestorID = $this->ID;
				}

				$revisionData =  $localFile->put($data, $ancestorID);
			}
			else
			{
				$revisionData = $localCollection->createFile($this->Handle, $data, $this->ID);
			}
		}
		
		header('X-Last-Revision: '.$this->ID);
		header('X-Revision: '.$revisionData['ID']);

		return $revisionData;
	}
	
	static public function getByHandle($collectionID, $handle)
	{
		if($_SERVER['REQUEST_METHOD'] == 'GET' && !empty($_SERVER['HTTP_X_REVISION_ID']))
			return static::getByID($_SERVER['HTTP_X_REVISION_ID']);
		else
			return parent::getByHandle($collectionID, $handle);
	}

}
