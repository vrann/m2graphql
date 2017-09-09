<?php
namespace Magento\GraphQL\Model;

use \Magento\Config\Model\Config\CommentInterface;

class Comment implements CommentInterface
{
    public function getCommentText($elementValue)  //the method has to be named getCommentText
    {
        //do some calculations here
        return $elementValue . 'Some string based on the calculations';
    }
}