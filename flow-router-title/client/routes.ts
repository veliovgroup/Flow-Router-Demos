import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { FlowRouterTitle } from 'meteor/ostrio:flow-router-title';
import { Collections } from '../lib/demo.collection';

declare const SubsManager: new () => { subscribe: typeof Meteor.subscribe };

const sm = new SubsManager();

FlowRouter.globals.push({ title: 'Default title' });

FlowRouter.notFound = {
  action(this: { render: (...args: unknown[]) => void }) {
    this.render('_layout', '_404', { rand: Random.id() });
  },
  title: '404: Page not found',
};

FlowRouter.route('/', {
  name: 'index',
  action(this: { render: (...args: unknown[]) => void }) {
    this.render('_layout', 'index', { rand: Random.id() });
  },
});

FlowRouter.route('/secondPage', {
  name: 'secondPage',
  title: 'Second Page title',
  action(this: { render: (...args: unknown[]) => void }) {
    this.render('_layout', 'secondPage', { rand: Random.id() });
  },
});

FlowRouter.route('/thirdPage/:something', {
  name: 'thirdPage',
  title(this: { params: { something: string } }) {
    return `Third Page Title > ${this.params.something}`;
  },
  action(this: { render: (...args: unknown[]) => void }, params: { something: string }) {
    this.render('_layout', 'thirdPage', { rand: params.something });
  },
});

const group = FlowRouter.group({
  prefix: '/group',
  title: 'GROUP TITLE',
  titlePrefix: 'Group > ',
});

group.route('/groupPage1', {
  name: 'groupPage1',
  action(this: { render: (...args: unknown[]) => void }) {
    this.render('_layout', 'groupPage1', { rand: Random.id() });
  },
});

group.route('/groupPage2', {
  name: 'groupPage2',
  title: 'Group page 2',
  action(this: { render: (...args: unknown[]) => void }) {
    this.render('_layout', 'groupPage2', { rand: Random.id() });
  },
});

const nestedGroup = group.group({
  prefix: '/level2',
  title: 'LEVEL2 GROUP TITLE',
  titlePrefix: 'Group Level 2 > ',
});

nestedGroup.route('/withoutTitle', {
  name: 'lvl2',
  action(this: { render: (...args: unknown[]) => void }) {
    this.render('_layout', 'lvl2', { rand: Random.id() });
  },
});

nestedGroup.route('/witTitle', {
  name: 'lvl2Title',
  title: 'Level 2 page',
  action(this: { render: (...args: unknown[]) => void }) {
    this.render('_layout', 'lvl2Title', { rand: Random.id() });
  },
});

FlowRouter.route('/post', {
  name: 'post',
  title: (_params: unknown, _query: unknown, post: { title?: string } | undefined) => post?.title,
  action(
    this: { render: (...args: unknown[]) => void },
    _params: unknown,
    _query: unknown,
    post: unknown,
  ) {
    this.render('_layout', 'post', { post, rand: Random.id() });
  },
  waitOn: () => [sm.subscribe('posts')],
  data: () => Collections.posts.findOne(),
  whileWaiting(this: { render: (...args: unknown[]) => void }) {
    this.render('_layout', '_loading');
  },
});

FlowRouter.route('/post/:_id', {
  name: 'post.id',
  title: (_params: unknown, _query: unknown, post: { title?: string } | undefined) =>
    post ? post.title : '404: Page not found',
  action(
    this: { render: (...args: unknown[]) => void },
    _params: unknown,
    _query: unknown,
    post: unknown,
  ) {
    this.render('_layout', 'post', { post, rand: Random.id() });
  },
  waitOn: () => [sm.subscribe('posts')],
  data: (params: { _id: string }) => Collections.posts.findOne(params._id),
  onNoData(this: { render: (...args: unknown[]) => void }) {
    this.render('_layout', '_404', { rand: Random.id() });
  },
  whileWaiting(this: { render: (...args: unknown[]) => void }) {
    this.render('_layout', '_loading');
  },
});

FlowRouter.route('/imgs', {
  name: 'imgs',
  title: (_params: unknown, _query: unknown, data: { title?: string } | undefined) =>
    data ? data.title : '404: Page not found',
  action(
    this: { render: (...args: unknown[]) => void },
    _params: unknown,
    _query: unknown,
    data: unknown,
  ) {
    this.render('_layout', 'imgs', { data, rand: Random.id() });
  },
  waitOnResources: (_params: unknown, _query: unknown, data: { images?: string[] } | undefined) => ({
    images: data?.images || [],
  }),
  data: () => ({
    title: 'DATA TITLE',
    images: [
      'https://static.pexels.com/photos/74536/kitchen-food-nuts-theme-patterns-74536.jpeg',
      'https://static.pexels.com/photos/87439/hornet-wasp-insect-sting-87439.jpeg',
      'https://static.pexels.com/photos/195537/pexels-photo-195537.jpeg',
    ],
  }),
  onNoData(this: { render: (...args: unknown[]) => void }) {
    this.render('_layout', '_404', { rand: Random.id() });
  },
  whileWaiting(this: { render: (...args: unknown[]) => void }) {
    this.render('_layout', '_loading');
  },
});

new FlowRouterTitle(FlowRouter);
