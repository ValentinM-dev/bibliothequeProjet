<?php

namespace App\DataFixtures;

use App\Entity\Author;
use App\Entity\Book;
use App\Entity\Editor;
use DateTime;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $author1 = new Author();
        $author1->setFirstName('Antoine');
        $author1->setLastName('de Saint Exupéry');
        $author1->setCountry('France');
        $manager->persist($author1);

        $author2 = new Author();
        $author2->setFirstName('George');
        $author2->setLastName('Orwell');
        $author2->setCountry('Royaume-Uni');
        $manager->persist($author2);

        $author3 = new Author();
        $author3->setFirstName('Joanne');
        $author3->setLastName('Rowling');
        $author3->setCountry('Royaume_Uni');
        $manager->persist($author3);

        $editor1 = new Editor();
        $editor1->setName('Gallimard Jeunesse');
        $editor1->setCreationDate(new DateTime('01/01/1972'));
        $editor1->setHeadquarters('Paris');
        $manager->persist($editor1);

        $editor2 = new Editor();
        $editor2->setName('Magnard');
        $editor2->setCreationDate(new DateTime('01/01/1936'));
        $editor2->setHeadquarters('Paris');
        $manager->persist($editor2);

        $editor3 = new Editor();
        $editor3->setName('Bloomsburry');
        $editor3->setCreationDate(new DateTime('09/26/1986'));
        $editor3->setHeadquarters('Londre');
        $manager->persist($editor3);

        $book1 = new Book();
        $book1->setTitle('Le Petit Prince');
        $book1->setDescription('L\'histoire d\'un petit prince qui voyage de planète en planète.');
        $book1->setPages(96);
        $book1->setImage('https://encryptedtbn0.gstatic.com/images?q=tbn:ANd9GcSfLtRjalUT26tXdZ3RHH8VRMzD0S0pT-tFDg&s');
        $book1->setAuthor($author1);
        $book1->setEditor($editor1);
        $manager->persist($book1);

        $book2 = new Book();
        $book2->setTitle('1984');
        $book2->setDescription('Un roman dystopique sur la surveillance de masse');
        $book2->setPages(368);
        $book2->setImage('https://encryptedtbn0.gstatic.com/images?q=tbn:ANd9GcSfLtRjalUT26tXdZ3RHH8VRMzD0S0pT-tFDg&s');
        $book2->setAuthor($author2);
        $book2->setEditor($editor2);
        $manager->persist($book2);

        $book3 = new Book();
        $book3->setTitle('Harry Pot de Fleur à l\'école des sorciers');
        $book3->setDescription('Le début des aventures du célèbre sorcier.');
        $book3->setPages(320);
        $book3->setImage('https://encryptedtbn0.gstatic.com/images?q=tbn:ANd9GcSfLtRjalUT26tXdZ3RHH8VRMzD0S0pT-tFDg&s');
        $book3->setAuthor($author3);
        $book3->setEditor($editor3);
        $manager->persist($book3);

        $manager->flush();
    }
}
