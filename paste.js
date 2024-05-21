
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_TECH } from '../utils/queries';
import { CREATE_MATCHUP } from '../utils/mutations';

const Matchup = () => {
  const { loading, data } = useQuery(QUERY_TECH);

  const techList = data?.tech || [];

  const [formData, setFormData] = useState({
    tech1: 'JavaScript',
    tech2: 'JavaScript',
  });
  let navigate = useNavigate();

  const [createMatchup, { error }] = useMutation(CREATE_MATCHUP);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await createMatchup({
        variables: { ...formData },
      });

      navigate(`/matchup/${data.createMatchup._id}`);
    } catch (err) {
      console.error(err);
    }

    setFormData({
      tech1: 'JavaScript',
      tech2: 'JavaScript',
    });
  };
};