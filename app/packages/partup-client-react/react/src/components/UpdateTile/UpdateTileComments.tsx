import './UpdateTileComments.css';

import * as React from 'react';
import * as c from 'classnames';
import { takeRight } from 'lodash';
import { Updates } from 'collections/Updates';
import { Comment } from 'components/Comment/Comment';
import { Clickable } from 'components/Button/Clickable';
import { CommentBox } from 'components/Comment/CommentBox';
import { Meteor } from 'utils/Meteor';
import { Users } from 'collections/Users';
import { UserAvatar } from 'components/Avatar/UserAvatar';
import { translate } from 'utils/translate';

interface Props {
    className?: string;
    collapsedMax?: number;
    update: any;
}

interface State {
    showAllComments: boolean;
    showCommentBox: boolean;
}

export class UpdateTileComments extends React.Component<Props, State> {

    public static defaultProps: Partial<Props> = {
        collapsedMax: 2,
    };

    public state: State = {
        showAllComments: false,
        showCommentBox: true,
    };

    private commentBoxComponent: CommentBox|null = null;

    public render() {
        const { update } = this.props;
        const { comments_count = 0 } = Updates.findOne({ _id: update._id }) || {};
        const { showCommentBox } = this.state;
        const user = Users.findLoggedInUser();

        return (
            <div className={this.getClassNames()}>
                <div className={`pur-UpdateTileComments__controls`}>
                    <Clickable
                        className={`pur-UpdateTileComments__control-reactions`}
                        onClick={this.toggleAllComments}
                    >
                        {translate('pur-dashboard-update_tile-comment_count', { comments_count })}
                    </Clickable>
                    {` • `}
                    <Clickable
                        className={`pur-UpdateTileComments__control-respond-link`}
                        onClick={this.handleCommentClick}
                    >
                        {translate('pur-dashboard-update_tile-comment')}
                    </Clickable>
                </div>

                { comments_count > 0 && this.renderComments() }

                {showCommentBox && (
                    <CommentBox
                        avatar={
                            <UserAvatar
                                user={user}
                                small
                                square />
                        }
                        ref={el => this.commentBoxComponent = el}
                        onSubmit={this.submitComment}
                        className={`pur-UpdateTileComments__comment-box`}
                    />
                )}
            </div>
        );
    }

    private renderComments() {
        const { update, collapsedMax } = this.props;
        const { comments = [], comments_count = 0 } = Updates.findOne({ _id: update._id }) || {};
        const { showAllComments } = this.state;

        const amountOfCommentToShow = showAllComments ? comments_count : collapsedMax;
        const commentComponents = comments
            .filter(({ type }) => type !== 'system')
            .map((comment: any) => {
                if (comment.type === 'motivation') {
                    return <Comment prefix={translate('pur-dashboard-update_tile-motivation_prefix')} key={comment._id} comment={comment} />;
                }

                return (
                    <Comment
                        onRemove={this.removeComment}
                        onSubmit={this.submitEditComment}
                        key={comment._id}
                        comment={comment} />
                );
            });

        return (
            <div className={`pur-UpdateTileComments__container`}>
                { takeRight(commentComponents, amountOfCommentToShow) }
            </div>

        );
    }

    private handleCommentClick = () => {
        const { showCommentBox } = this.state;

        if (showCommentBox) {
            if (this.commentBoxComponent) this.commentBoxComponent.focus();
        } else {
            this.setState({
                showCommentBox: true,
            }, () => {
                if (this.commentBoxComponent) this.commentBoxComponent.focus();
            });
        }
    }

    private toggleAllComments = () => {
        this.setState({
            showAllComments: !this.state.showAllComments,
        });
    }

    private submitComment = (e: Event, { comment }: {comment: string}) => {
        e.preventDefault();
        const { update } = this.props;

        Meteor.call('updates.comments.insert', update._id, {
            content: comment.trim(),
        });
    }

    private submitEditComment = (e: Event, { comment, commentId }: {comment: string, commentId: string}) => {
        e.preventDefault();
        const { update } = this.props;

        Meteor.call('updates.comments.update', update._id, commentId, {
            content: comment.trim(),
        });
    }

    private removeComment = (e: Event, { commentId }: {commentId: string}) => {
        e.preventDefault();
        const { update } = this.props;

        Meteor.call('updates.comments.remove', update._id, commentId);
    }

    private getClassNames() {
        const { className } = this.props;

        return c('pur-UpdateTileComments', className, {

        });
    }
}