const router = require('express').Router();
const { addComment, removeComment, addReply, removeReply } = require('../../controllers/comment-controller.js');

// /api/comments/<pizzaId>
router.route('/:pizzaId').post(addComment);

// /api/comment/<pizzaId>/<commentId>
router
    .route('/:pizzaId/:commentId')
    .put(addReply)
    .delete(removeComment)

router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);

module.exports = router;