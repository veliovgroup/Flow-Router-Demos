import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { FlowRouterMeta, FlowRouterTitle } from 'meteor/ostrio:flow-router-meta';
import { Collections } from '../lib/demo.collection';

FlowRouter.globals.push({ title: 'Default title' });
FlowRouter.globals.push({
  link: {
    twbs: {
      rel: 'stylesheet',
      href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css',
    },
    canonical: {
      rel: 'canonical',
      itemprop: 'url',
      href: () =>
        Meteor.absoluteUrl(
          (FlowRouter.current()?.path || document.location.pathname).replace(/^\//g, ''),
        ),
    },
  },
});

FlowRouter.globals.push({
  script: { twbs: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js' },
});

FlowRouter.globals.push({
  meta: {
    description: {
      name: 'description',
      content: 'Default Demo FlowRouterMeta description',
      property: 'og:description',
    },
  },
});

FlowRouter.route('*', {
  name: 'notFound',
  action(this: { render: (...args: unknown[]) => void }) {
    this.render('_layout', '_404', { rand: Random.id() });
  },
  title: '404: Page not found',
  meta: {
    robots: 'noindex, nofollow',
    description: 'Non-existent route',
  },
});

FlowRouter.route('/', {
  name: 'index',
  action(this: { render: (...args: unknown[]) => void }) {
    this.render('_layout', 'index', { rand: Random.id() });
  },
});

FlowRouter.route('/secondPage', {
  name: 'secondPage',
  title: 'Second Page title',
  meta: { description: 'Second Page description' },
  link: {
    twbs: {
      rel: 'stylesheet',
      href: 'https://maxcdn.bootstrapcdn.com/bootstrap/2.2.0/css/bootstrap.min.css',
    },
  },
  script: { twbs: 'https://maxcdn.bootstrapcdn.com/bootstrap/2.2.0/js/bootstrap.min.js' },
  action(this: { render: (...args: unknown[]) => void }) {
    this.render('_layout', 'secondPage', { rand: Random.id() });
  },
});

FlowRouter.route('/thirdPage/:something', {
  name: 'thirdPage',
  title: (params: { something: string }) => `Third Page Title > ${params.something}`,
  action(this: { render: (...args: unknown[]) => void }, params: { something: string }) {
    this.render('_layout', 'thirdPage', { rand: params.something });
  },
});

const group = FlowRouter.group({
  prefix: '/group',
  title: 'GROUP TITLE',
  titlePrefix: 'Group > ',
  link: {
    twbs: {
      rel: 'stylesheet',
      href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha/css/bootstrap.min.css',
    },
  },
  script: {
    twbs: {
      src: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha/js/bootstrap.min.js',
      type: 'text/javascript',
      defer: true,
      async: true,
    },
  },
  meta: { description: 'Group description' },
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
  meta: { description: 'Overridden group description by group member route' },
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
  waitOn: () => [Meteor.subscribe('posts')],
  data: () => Collections.posts.findOne(),
  whileWaiting(this: { render: (...args: unknown[]) => void }) {
    this.render('_layout', '_loading');
  },
  meta: (_params: unknown, _query: unknown, post: { keywords?: string; description?: string } | undefined) => ({
    keywords: post?.keywords,
    description: post?.description,
  }),
});

new FlowRouterMeta(FlowRouter);
new FlowRouterTitle(FlowRouter);
