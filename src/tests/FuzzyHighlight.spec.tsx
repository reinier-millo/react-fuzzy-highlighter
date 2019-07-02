import { mount } from 'enzyme';
import { FuseOptions } from 'fuse.js';
import * as React from 'react';
import FuzzyHighlight from '../FuzzyHighlight';

describe('FuzzyHighlight', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('instantiates without crashing', () => {
    const wrapper = mount<FuzzyHighlight<{ t: string }, undefined>>(
      <FuzzyHighlight<{ t: string }, undefined> query="" data={[{ t: '' }]}>
        {({ results }) => JSON.stringify(results)}
      </FuzzyHighlight>
    );
    expect(wrapper).toBeTruthy();
  });

  test('search method is called', () => {
    const wrapper = mount<FuzzyHighlight<{ t: string }, undefined>>(
      <FuzzyHighlight<{ t: string }, undefined> query="" data={[{ t: '' }]}>
        {({ results }) => JSON.stringify(results)}
      </FuzzyHighlight>
    );

    const search = jest.spyOn(wrapper.instance(), 'search');

    expect(search).toHaveBeenCalledTimes(0);
    wrapper.setProps({ query: 'data' });
    expect(search).toHaveBeenCalledTimes(1);
  });

  test('search has cache', () => {
    const wrapper = mount<FuzzyHighlight<{ t: string }, undefined>>(
      <FuzzyHighlight<{ title: string }, FuseOptions<{ title: string }>>
        query=""
        data={[
          { title: "Old Man's War" },
          { title: 'The Lock Artist' },
          { title: 'HTML5' }
        ]}
        options={{
          shouldSort: true,
          includeMatches: true,
          threshold: 0.6,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: ['title']
        }}
      >
        {({ results }) => JSON.stringify(results)}
      </FuzzyHighlight>
    );

    expect(wrapper.state().cache).toEqual({
      '': []
    });

    wrapper.setProps({ query: 'old' });

    expect(wrapper.state().cache).toEqual({
      '': [],
      old: [
        {
          item: { title: "Old Man's War" },
          matches: [
            {
              arrayIndex: 0,
              indices: [[0, 2]],
              key: 'title',
              value: "Old Man's War"
            }
          ]
        }
      ]
    });

    expect(wrapper.state().info.timing).toBeGreaterThan(0);
    wrapper.setProps({ query: '' });
    expect(wrapper.state().info.timing).toEqual(0);
  });
});
